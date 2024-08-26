import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomRequestError } from 'errors/CustomError';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

interface TokenPayload {
  email: string;
  id: string;
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new CustomRequestError({
      code: 401,
      message: 'Unauthorized access',
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw new CustomRequestError({
        code: 403,
        message: 'forbidden',
      });
    }
    const { id, email } = decoded as TokenPayload;
    res.locals.id = id;
    res.locals.email = email;
    next();
  });
};

export default verifyJWT;
