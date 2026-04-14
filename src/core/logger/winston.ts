// internal-imports
import { APP_CONFIG } from '../config/constants.js';
import { env } from '../config/env.js';

// external-imports
import DailyRotateFile from 'winston-daily-rotate-file';
import winston from 'winston';

// create logger instance
export const logger = winston.createLogger({
  // logging format
  format: winston.format.combine(
    winston.format.timestamp({ format: APP_CONFIG.WINSTON_CONFIG.TIMESTAMP_FORMAT }),
    winston.format.errors({ stack: true }),
    winston.format.printf(
      log =>
        `(${env.NODE_ENV.toUpperCase()}) ${log.timestamp} [${log.level.toUpperCase()}]: ${log.stack ?? log.message}`
    )
  ),
});

// for non-development environments(production, testing), log to file
if (env.NODE_ENV !== APP_CONFIG.NODE_ENVS.DEVELOPMENT) {
  // transport for logging all levels to combined file
  logger.add(
    new DailyRotateFile({
      dirname: APP_CONFIG.WINSTON_CONFIG.DIR_PATH,
      filename: APP_CONFIG.WINSTON_CONFIG.COMBINED_FILE_NAME,
      datePattern: APP_CONFIG.WINSTON_CONFIG.DATE_PATTERN,
    })
  );

  // transport for logging error level to error file
  logger.add(
    new DailyRotateFile({
      dirname: APP_CONFIG.WINSTON_CONFIG.DIR_PATH,
      filename: APP_CONFIG.WINSTON_CONFIG.ERROR_FILE_NAME,
      level: 'error',
      datePattern: APP_CONFIG.WINSTON_CONFIG.DATE_PATTERN,
    })
  );
}

// for non-production environments(development, testing), log to console
if (env.NODE_ENV !== APP_CONFIG.NODE_ENVS.PRODUCTION)
  logger.add(new winston.transports.Console({ format: winston.format.colorize({ all: true }) }));
