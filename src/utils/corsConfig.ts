import { CorsOptions } from 'cors';

// Add the allowed origins to the array
const allowedOrigins = ['http://localhost:5173'];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export default corsOptions;
