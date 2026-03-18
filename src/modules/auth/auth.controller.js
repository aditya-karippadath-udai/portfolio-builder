import { registerUser, loginUser } from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const data = await registerUser({ email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const data = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (err) {
    next(err);
  }
};