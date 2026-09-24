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

    // 1. Create product_variants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "product_variants" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "variantName" TEXT NOT NULL,
        "variantType" TEXT NOT NULL DEFAULT 'Renk',
        "imageUrl" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS "product_variants_productId_idx" ON "product_variants"("productId");
    `)
    console.log('Checked and verified product_variants table.')

    // 2. Add variantId and variantName columns to InquiryItem if not exist
    await client.query(`
      ALTER TABLE "InquiryItem"
      ADD COLUMN IF NOT EXISTS "variantId" TEXT REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE,
      ADD COLUMN IF NOT EXISTS "variantName" TEXT;
      CREATE INDEX IF NOT EXISTS "InquiryItem_variantId_idx" ON "InquiryItem"("variantId");
    `)
    console.log('Checked and verified InquiryItem variant columns.')

    console.log('Variant tables and columns setup completed successfully!')
  } catch (err) {
    console.error('Error creating variant tables:', err)
  } finally {
    await client.end()
  }
}

run()
