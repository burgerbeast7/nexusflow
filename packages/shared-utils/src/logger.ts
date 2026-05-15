import winston from 'winston';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, service, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${service}] ${level}: ${message}${metaStr}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

export function createLogger(service: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  return winston.createLogger({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    defaultMeta: { service },
    format: isProduction ? prodFormat : devFormat,
    transports: [
      new winston.transports.Console(),
      ...(isProduction
        ? [
            new winston.transports.File({
              filename: `logs/${service}-error.log`,
              level: 'error',
              maxsize: 10 * 1024 * 1024, // 10MB
              maxFiles: 5,
            }),
            new winston.transports.File({
              filename: `logs/${service}-combined.log`,
              maxsize: 10 * 1024 * 1024,
              maxFiles: 10,
            }),
          ]
        : []),
    ],
  });
}
