import { Hono } from 'hono';
import { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

// 1. GET ALL (Tetap sama)
app.get('/', async (c) => {
  const query = c.req.query('q') || '';
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM customers 
      WHERE name LIKE ? OR whatsapp LIKE ? 
      ORDER BY created_at DESC
    `).bind(`%${query}%`, `%${query}%`).all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 2. GET DETAIL (Update: Filter deleted_at IS NULL)
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const customer = await c.env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first();
    if (!customer) return c.json({ error: 'Pelanggan tidak ditemukan' }, 404);

    // [UPDATE] Hanya ambil yang deleted_at NULL
    const { results: products } = await c.env.DB.prepare(`
      SELECT * FROM customer_products 
      WHERE customer_id = ? AND deleted_at IS NULL 
      ORDER BY created_at DESC
    `).bind(id).all();

    return c.json({ customer, products });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 3. REGISTER CUSTOMER (Tetap sama)
app.post('/', async (c) => {
  // ... (kode lama) ...
  try {
    const { name, email, whatsapp, address } = await c.req.json();
    const id = crypto.randomUUID(); 
    await c.env.DB.prepare(`INSERT INTO customers (id, name, email, whatsapp, address) VALUES (?, ?, ?, ?, ?)`).bind(id, name, email || '', whatsapp, address).run();
    return c.json({ success: true, message: 'Pelanggan berhasil didaftarkan', id });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 4. ADD PRODUCT (Tetap sama)
app.post('/:id/products', async (c) => {
  const customerId = c.req.param('id');
  // Terima format baru: { base: {...}, variants: [...] }
  const { base, variants } = await c.req.json();
  
  // Validasi sederhana
  if (!base || !variants || !Array.isArray(variants)) {
    return c.json({ error: 'Format data tidak valid' }, 400);
  }

  try {
    // Siapkan Statement SQL
    const stmt = c.env.DB.prepare(`
      INSERT INTO customer_products (
        id, customer_id, product_name, brand, 
        nib, pirt, halal,
        variant, netto, packaging_type, size
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Buat Array Promises untuk Batch Insert
    const batch = variants.map((v: any) => {
      const id = crypto.randomUUID();
      return stmt.bind(
        id, 
        customerId, 
        base.product_name, 
        base.brand, 
        base.nib, 
        base.pirt, 
        base.halal,
        v.variant, // Data Variabel
        v.netto,   // Data Variabel
        v.packaging_type, // Data Variabel
        v.size     // Data Variabel
      );
    });

    // Jalankan semua insert sekaligus (Atomic Transaction)
    await c.env.DB.batch(batch);

    return c.json({ success: true, count: batch.length });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 5. [BARU] UPDATE PRODUCT
app.patch('/products/:productId', async (c) => {
  const productId = c.req.param('productId');
  const body = await c.req.json();
  
  // Dynamic Query Builder (sama seperti User Update)
  const updates: string[] = [];
  const values: any[] = [];
  
  const fields = ['product_name', 'brand', 'variant', 'netto', 'packaging_type', 'size', 'nib', 'pirt', 'halal'];
  
  fields.forEach(field => {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  });

  if (updates.length === 0) return c.json({ error: "No data" }, 400);
  
  values.push(productId);
  const sql = `UPDATE customer_products SET ${updates.join(", ")} WHERE id = ?`;

  try {
    await c.env.DB.prepare(sql).bind(...values).run();
    return c.json({ success: true, message: 'Produk diperbarui' });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 6. [BARU] SOFT DELETE PRODUCT
app.delete('/products/:productId', async (c) => {
  const productId = c.req.param('productId');
  try {
    // Set deleted_at ke timestamp sekarang
    await c.env.DB.prepare(`UPDATE customer_products SET deleted_at = ? WHERE id = ?`)
      .bind(Math.floor(Date.now() / 1000), productId)
      .run();
    return c.json({ success: true, message: 'Produk dihapus' });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;