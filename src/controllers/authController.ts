import { Request, Response } from 'express';
import { CustomRequestError } from '../errors/CustomError';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/script';

interface ITokenPayload {
  email: string;
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

// @desc Register
// @route POST /auth/register
// @access Public
const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomRequestError({
      code: 400,
      message: 'All fields are required',
      context: { fields: ['name', 'email', 'password'] },
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new CustomRequestError({
      code: 400,
      message: 'User already exists',
      context: { fields: ['email'] },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json({ message: 'User created' });
};

// @desc Login
// @route POST /auth/login
// @access Public
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExist = await prisma.user.findUnique({
    where: { email },
  });

  if (!userExist) {
    throw new CustomRequestError({
      code: 400,
      message: 'Invalid credentials',
      context: { fields: ['email', 'password'] },
    });
  }

  const passwordMatch = await bcrypt.compare(password, userExist.password);

  if (!passwordMatch) {
    throw new CustomRequestError({
      code: 400,
      message: 'Invalid credentials',
      context: { fields: ['email', 'password'] },
    });
  }

  const accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken,
  });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    throw new CustomRequestError({
      code: 401,
      message: 'unauthorized',
    });
  }

  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as ITokenPayload;

    const existingUser = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!existingUser) {
      throw new CustomRequestError({
        code: 401,
        message: 'unauthorized',
      });
    }

    const accessToken = jwt.sign({ email: existingUser.email }, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    return res.json({ accessToken });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new CustomRequestError({
      code: 401,
      message: 'unauthorized',
    });
  }
};

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none' });

  return res.json({ message: 'Log out successfully' });
};

export default { register, login, refresh, logout };
