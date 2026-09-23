import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const DEFAULT_DATABASE_URL =
  'postgresql://postgres.gvdigwwufllbmlmxxjdf:159263Ahmetcan@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true'

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
      ? process.env.DATABASE_URL
      : DEFAULT_DATABASE_URL

  const adapter = new PrismaPg(connectionString)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
