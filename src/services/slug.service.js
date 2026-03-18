import { db } from '../config/db.js';

const generateSlug = async (title) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  let slug;
  let isUnique = false;

  while (!isUnique) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    slug = `${base}-${suffix}`;

    const existing = await db.portfolio.findUnique({ where: { slug } });
    if (!existing) isUnique = true;
  }

  return slug;
};

export { generateSlug };