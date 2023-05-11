import { fork } from 'child_process';
import { resolve } from 'path';

import chalk from 'chalk';
import webpack from 'webpack';

import webpackConfiguration from '../configuration/webpack.config.cjs';

const compiler = webpack(webpackConfiguration);

const formatDate = (time, format = 'YY-MM-DD hh:mm:ss') => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const preArr = Array(10)
    .fill()
    .map((elem, index) => `0${index}`);
  const newTime = format
    .replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec);
  return newTime;
};

process.on('SIGINT', async () => {
  if (compiler) {
    process.stdout.write(chalk.gray('PACKER: Colsing...\n'));
    compiler.close((error) => {
      if (error) {
        process.stderr.write(`PACKER: ${error}\n`);
      }
    });
  }
});

fork(resolve(process.cwd(), './commands/server.js')).on(
  'message',
  (message) => {
    if (message === 'server ready') {
      compiler.watch({}, (error, stats) => {
        if (stats.hasWarnings()) {
          process.stdout.write(
            chalk.bold.yellowBright(`PACKER: ${stats.compilation.warnings}\n`),
          );
        }

        if (error || stats.hasErrors()) {
          process.stdout.write('\r');
          process.stdout.write('\r\x1b[K');

          if (stats.compilation.errors && !error) {
            process.stderr.write(
              chalk.bold.redBright(`PACKER: ${stats.compilation.errors}\n`),
            );
          }
          if (error) {
            process.stderr.write(chalk.bold.redBright(`PACKER: ${error}\n`));
          }
        }

        process.stdout.write('\r');
        process.stdout.write('\r\x1b[K');

        process.stdout.write(
          [
            `${chalk.gray('PACKER:')}`,
            `${chalk.gray(formatDate(new Date().getTime()))}`,
            `${chalk.gray('Compile completed.')}`,
            `\n`,
          ].join(' '),
        );
      });
    }
  },
);
