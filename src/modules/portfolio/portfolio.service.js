import { db } from '../config/db.js';
import { generateSlug } from './slug.service.js';
import { ApiError } from '../utils/ApiError.js';

export const createPortfolioService = async ({ userId, title, theme, sections }) => {
  const slug = await generateSlug(title);

  const portfolio = await db.portfolio.create({
    data: {
      title,
      theme,
      slug,
      userId,
      sections: JSON.stringify(sections),
    },
  });

  return { ...portfolio, sections: JSON.parse(portfolio.sections) };
};

export const getPortfolioService = async ({ id, userId }) => {
  const portfolio = await db.portfolio.findUnique({ where: { id } });

  if (!portfolio) {
    throw new ApiError(404, 'Portfolio not found');
  }

  if (portfolio.userId !== userId) {
    throw new ApiError(403, 'You do not have access to this portfolio');
  }

  return { ...portfolio, sections: JSON.parse(portfolio.sections) };
};

export const updatePortfolioService = async ({ id, userId, title, theme, sections }) => {
  const portfolio = await db.portfolio.findUnique({ where: { id } });

  if (!portfolio) {
    throw new ApiError(404, 'Portfolio not found');
  }

  if (portfolio.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to update this portfolio');
  }

  const slug = title !== portfolio.title ? await generateSlug(title) : portfolio.slug;

  const updated = await db.portfolio.update({
    where: { id },
    data: {
      title,
      theme,
      slug,
      sections: JSON.stringify(sections),
    },
  });

  return { ...updated, sections: JSON.parse(updated.sections) };
};

export const deletePortfolioService = async ({ id, userId }) => {
  const portfolio = await db.portfolio.findUnique({ where: { id } });

  if (!portfolio) {
    throw new ApiError(404, 'Portfolio not found');
  }

  if (portfolio.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to delete this portfolio');
  }

  await db.portfolio.delete({ where: { id } });
};