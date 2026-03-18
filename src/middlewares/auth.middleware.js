import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    if (err.name === 'TokenExpiredError') return next(new ApiError(401, 'Token expired'));
    if (err.name === 'JsonWebTokenError') return next(new ApiError(401, 'Invalid token'));
    next(err);
  }
};