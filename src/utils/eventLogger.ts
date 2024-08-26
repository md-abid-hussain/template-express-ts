import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import { v4 as uuid } from 'uuid';

const eventLogger = async (message: string, logFile: string): Promise<void> => {
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

export default eventLogger;
