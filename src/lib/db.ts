import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure DATABASE_URL with connection pool parameters
const getDatabaseUrl = () => {
  const baseUrl = process.env.DATABASE_URL
  if (!baseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Add connection pool parameters to the URL
  const url = new URL(baseUrl)
  url.searchParams.set('connection_limit', '100')
  url.searchParams.set('pool_timeout', '30')
  url.searchParams.set('sslmode', 'prefer')

  return url.toString()
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma