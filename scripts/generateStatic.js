import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import { db } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const TEMPLATE_PATH = path.resolve('templates', 'portfolio.template.ejs');
const OUTPUT_DIR    = path.resolve('public', 'exports');

export const generateStaticSite = async (portfolioId) => {
  const portfolio = await db.portfolio.findUnique({
    where: { id: portfolioId },
    include: { projects: true },
  });

  if (!portfolio) {
    throw new ApiError(404, 'Portfolio not found');
  }

  const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');

  const html = ejs.render(template, {
    title:    portfolio.title,
    theme:    portfolio.theme,
    sections: portfolio.sections,
    projects: portfolio.projects,
    year:     new Date().getFullYear(),
  });

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const outputPath = path.join(OUTPUT_DIR, `${portfolio.slug}.html`);

  await fs.writeFile(outputPath, html, 'utf-8');

  return outputPath;
};