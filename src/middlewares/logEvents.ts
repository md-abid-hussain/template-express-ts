import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import { v4 as uuid } from 'uuid';
import { type Request, type Response, type NextFunction } from 'express';

export const logEvents = async (message: string, logFile: string): Promise<void> => {
  const dateTime = new Date().toISOString();
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    const logDir = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(logDir)) {
      await fsPromises.mkdir(logDir);
    }
    await fsPromises.appendFile(path.join(logDir, logFile), logItem);
  } catch (err) {
    console.error(err);
  }
};

export const logger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await logEvents(`${req.method}\t${req.get('origin')}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method}\t${req.path}`);
  next();
};
