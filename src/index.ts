import { config } from 'dotenv';
config();
import 'express-async-errors';
import express, { Express, Request, Response } from 'express';
import { logger } from './middlewares/logEvents';
import { errorHandler } from './middlewares/errorHandler';
import { CustomRequestError } from './errors/CustomError';
import { prisma } from './prisma/script';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import swaggerOptions from './configs/swaggerConfig';
// Routes
import authRoute from './routes/authRoute';

const app: Express = express();
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/auth', authRoute);
app.use('/', (req: Request, res: Response) => {
  return res.send('Welcome to the API');
});

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
