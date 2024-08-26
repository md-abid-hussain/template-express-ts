import { config } from 'dotenv';
config();

import express, { Express, Request, Response } from 'express';
import { logger } from './middlewares/logEvents';
import { errorHandler } from './middlewares/errorHandler';
import { CustomRequestError } from './errors/CustomError';
import { prisma } from './prisma/script';

const app: Express = express();
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoute from './routes/authRoute';

app.use('/', (req: Request, res: Response) => {
  res.send('Welcome to the API');
});
app.use('/auth', authRoute);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', (req: Request, res: Response) => {
  throw new CustomRequestError({
    code: 404,
    message: `method ${req.method} not allowed on ${req.originalUrl} on this server`,
    context: { method: req.method, url: req.originalUrl },
  });
});

app.use(errorHandler);

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});
