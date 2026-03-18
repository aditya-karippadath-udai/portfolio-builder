import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

db.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export { db };