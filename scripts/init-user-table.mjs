import pg from 'pg'
const { Client } = pg

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.gvdigwwufllbmlmxxjdf:159263Ahmetcan@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true'

const client = new Client({ connectionString })

async function run() {
  try {
    await client.connect()
    console.log('Connected to PostgreSQL database.')

    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "phone" TEXT,
        "company" TEXT,
        "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `)
    console.log('Checked and verified User table in PostgreSQL!')
  } catch (err) {
    console.error('Error creating User table:', err)
  } finally {
    await client.end()
  }
}

run()
