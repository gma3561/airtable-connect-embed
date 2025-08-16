import { Request, Response, NextFunction } from 'express';

export function requestLogger() {
  return function logger(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();
    const method = req.method;
    const url = req.originalUrl || req.url;

    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      const status = res.statusCode;
      // eslint-disable-next-line no-console
      console.log(`${method} ${url} ${status} ${durationMs.toFixed(1)}ms`);
    });

    next();
  };
}
