import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  const prods = await client.query('SELECT id, name, slug, colors FROM "Product"');
  console.log(`Found ${prods.rows.length} products in DB.`);

  for (const prod of prods.rows) {
    const existingVars = await client.query('SELECT count(*) FROM product_variants WHERE "productId" = $1', [prod.id]);
    const count = parseInt(existingVars.rows[0].count, 10);
    console.log(`Product "${prod.name}" (${prod.id}) has ${count} variants.`);

    if (count === 0) {
      // Seed default variants based on product colors or defaults
      const colors = (prod.colors && prod.colors.length > 0)
        ? prod.colors
        : ['Siyah', 'Ham Bej', 'Lacivert'];

      const sampleImages = [
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
      ];

      for (let i = 0; i < colors.length; i++) {
        const colorName = colors[i];
        const img = sampleImages[i % sampleImages.length];
        const varId = `var-${prod.id.slice(0, 8)}-${i}`;
        await client.query(
          `INSERT INTO product_variants (id, "productId", "variantName", "variantType", "imageUrl", "sortOrder")
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [varId, prod.id, colorName, 'Renk', img, i]
        );
      }
      console.log(`-> Seeded ${colors.length} variants for "${prod.name}".`);
    }
  }

  const finalCheck = await client.query('SELECT count(*) FROM product_variants');
  console.log('Total product_variants count:', finalCheck.rows[0].count);

  await client.end();
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
