import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  const prods = await client.query(`
    SELECT p.*,
      json_agg(DISTINCT jsonb_build_object('id', img.id, 'url', img.url, 'alt', img.alt, 'order', img.order)) FILTER (WHERE img.id IS NOT NULL) as images,
      json_agg(DISTINCT jsonb_build_object('id', v.id, 'variantName', v."variantName", 'variantType', v."variantType", 'imageUrl', v."imageUrl", 'sortOrder', v."sortOrder")) FILTER (WHERE v.id IS NOT NULL) as variants
    FROM "Product" p
    LEFT JOIN "ProductImage" img ON img."productId" = p.id
    LEFT JOIN product_variants v ON v."productId" = p.id
    GROUP BY p.id
  `);

  const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
  fs.writeFileSync(filePath, JSON.stringify(prods.rows, null, 2), 'utf-8');
  console.log(`Updated ${filePath} with ${prods.rows.length} products including variants.`);
  await client.end();
}

main().catch(console.error);
