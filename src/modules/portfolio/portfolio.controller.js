import {
  createPortfolioService,
  getPortfolioService,
  updatePortfolioService,
  deletePortfolioService,
} from '../services/portfolio.service.js';

export const createPortfolio = async (req, res, next) => {
  try {
    const { title, theme, sections } = req.body;
    const { userId } = req.user;

    const data = await createPortfolioService({ userId, title, theme, sections });

    res.status(201).json({
      success: true,
      message: 'Portfolio created successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getPortfolio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const data = await getPortfolioService({ id, userId });

    res.status(200).json({
      success: true,
      message: 'Portfolio fetched successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { title, theme, sections } = req.body;

    const data = await updatePortfolioService({ id, userId, title, theme, sections });

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    await deletePortfolioService({ id, userId });

    res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};