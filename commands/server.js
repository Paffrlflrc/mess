import chalk from 'chalk';
import fastify from 'fastify';

import fastifyInstanceConfiguration from '../configuration/server/instance.js';

import plugin from '../configuration/server/plugin.js';

import router from '../router.js';

const server = fastify(fastifyInstanceConfiguration);

process.on('SIGINT', async () => {
  if (server) {
    process.stdout.write(chalk.gray('SERVER: Colsing...\n'));
    await server.close().then(
      () => {
        process.stdout.write('SERVER: Close.');
        return true;
      },
      (error) => {
        process.stderr.write(`SERVER: ${error}\n`);
      },
    );
  }
});

await plugin(server);

router(server);

server.ready(() => {
  process.send('server ready');
});

server
  .listen({
    port: 8080,
    host: '0.0.0.0',
  })
  .catch((error) => {
    const processName = 'Server';
    const main = error;

    const errorMessage = [
      `${processName.toUpperCase()}: `,
      `${main}`,
      `\n`,
    ].join('');

    process.stderr.write(chalk.bold.redBright(errorMessage));
    server.close();
  });
