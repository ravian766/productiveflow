import { PrismaClient } from '@prisma/client'

declare global {
  var cachedPrisma: PrismaClient | undefined
}

export const db = globalThis.cachedPrisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.cachedPrisma = db
}
