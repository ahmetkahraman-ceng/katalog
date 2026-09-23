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

    // 1. Add badge and tags columns to Product if not exist
    await client.query(`
      ALTER TABLE "Product" 
      ADD COLUMN IF NOT EXISTS "badge" TEXT,
      ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
    `)
    console.log('Checked Product table columns (badge, tags).')

    // 2. Create ProductSpec table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ProductSpec" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "specKey" TEXT NOT NULL,
        "specValue" TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "ProductSpec_productId_idx" ON "ProductSpec"("productId");
    `)
    console.log('Checked ProductSpec table.')

    // 3. Create ProductExample table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ProductExample" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "imageUrl" TEXT NOT NULL,
        "title" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "ProductExample_productId_idx" ON "ProductExample"("productId");
    `)
    console.log('Checked ProductExample table.')

    // 4. Create ProductFaq table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ProductFaq" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "question" TEXT NOT NULL,
        "answer" TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX IF NOT EXISTS "ProductFaq_productId_idx" ON "ProductFaq"("productId");
    `)
    console.log('Checked ProductFaq table.')

    console.log('All required tables and columns verified successfully!')
  } catch (err) {
    console.error('Error ensuring tables:', err)
  } finally {
    await client.end()
  }
}

run()
