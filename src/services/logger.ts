import { NextFunction, Request, Response } from 'express';
import { env } from 'node:process';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    ...(['dev', 'production'].includes(env.NODE_ENV as string)
      ? [new transports.Console()]
      : []),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

function logMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.info({
    message: 'HTTP Request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    headers: req.headers,
    env: env.NODE_ENV,
  });

  res.on('finish', () => {
    logger.info({
      message: 'HTTP Response',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      env: env.NODE_ENV,
    });
  });

  next();
}

export { logger, logMiddleware };
