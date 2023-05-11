import { resolve } from "path";

import build from "pino-abstract-transport";
import chalk from "chalk";

const transport = async () =>
  build(async (source) => {
    source.forEach((object) => {
      const output = `SERVER: ${object.message}`;

      switch (object.level) {
        case 30: {
          const serverInfo = `${chalk.gray(output)}\n`;
          process.stdout.write(serverInfo);
          break;
        }
        case 40: {
          const serverInfo = `${chalk.bold.yellowBright(output)}\n`;
          process.stdout.write(serverInfo);
          break;
        }
        case 50:
        case 60: {
          const serverInfo = `${chalk.bold.redBright(output)}\n`;
          process.stderr.write(serverInfo);
          break;
        }
        default: {
          process.stderr.write(
            chalk.bold
              .red(`SERVER: The level of the next log is not standardized. Should be added in 
              ${resolve(
                process.cwd(),
                "./configuration/server/log/standard.js"
              )}`)
          );

          const serverInfo = `${chalk.bold.redBright(output)}\n`;
          process.stderr.write(serverInfo);
          break;
        }
      }
    });
  });

export default transport;
