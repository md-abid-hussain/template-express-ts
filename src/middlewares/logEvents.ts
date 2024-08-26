import { type Request, type Response, type NextFunction } from 'express';
import eventLogger from '../utils/eventLogger';

export const logger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await eventLogger(`${req.method}\t${req.get('origin')}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method}\t${req.path}`);
  next();
};
