import { resolve } from 'path';

import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const configuration = {};

configuration.logger = isProduction
  ? pino(
      pino.transport({
        pipeline: [
          {
            target: 'pino-syslog',
            options: {
              messageOnly: true,
              newline: true,
            },
          },
          {
            target: resolve(
              process.cwd(),
              './configuration/server/log/fileRotate.js',
            ),
          },
        ],
      }),
    )
  : pino({
      base: undefined,
      errorKey: 'error',
      messageKey: 'message',
      timestamp: pino.stdTimeFunctions.isoTime,
      transport: {
        target: resolve(
          process.cwd(),
          './configuration/server/log/standard.js',
        ),
      },
    });

export default configuration;
