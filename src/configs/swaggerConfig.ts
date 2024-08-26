import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ultimate Open Source Starter Kit API',
      version: '1.0.0',
      description: 'API documentation for the Ultimate Open Source Starter Kit',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export default swaggerOptions;
