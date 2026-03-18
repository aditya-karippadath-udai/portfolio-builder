import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import config from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

export const registerUser = async ({ email, password }) => {
  const existing = await db.user.findUnique({ where: { email } });

  if (existing) {
    throw new ApiError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await db.user.create({
    data: { email, password: hashedPassword },
    select: { id: true, email: true, createdAt: true },
  });

  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const safeUser = { id: user.id, email: user.email, createdAt: user.createdAt };

  const token = generateToken({ userId: user.id, email: user.email });

  return { user: safeUser, token };
};

const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
};