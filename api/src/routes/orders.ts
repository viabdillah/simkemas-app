import { Hono } from 'hono';
import { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

app.post('/', async (c) => {
  // [REVISI] Hapus pickup_method dari request body
  const { customer_id, items, total_amount, deadline_date } = await c.req.json();
  
  const orderId = crypto.randomUUID();
  const date = new Date();
  const invoiceNumber = `INV/${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}/${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // [REVISI] Hapus pickup_method dari Query SQL
    await c.env.DB.prepare(`
      INSERT INTO orders (id, customer_id, invoice_number, total_amount, status, deadline_date)
      VALUES (?, ?, ?, ?, 'PENDING', ?)
    `).bind(
      orderId, 
      customer_id, 
      invoiceNumber, 
      total_amount, 
      deadline_date || null
    ).run();

    // ... (Bagian Insert Order Items TETAP SAMA seperti sebelumnya) ...
    const stmt = c.env.DB.prepare(`
      INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price, has_design, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const batch = items.map((item: any) => {
      return stmt.bind(
        crypto.randomUUID(),
        orderId,
        item.product_id,
        item.product_name,
        item.quantity,
        item.price,
        item.has_design ? 1 : 0,
        item.notes || ''
      );
    });

    await c.env.DB.batch(batch);

    return c.json({ success: true, message: 'Pesanan berhasil dibuat', invoice: invoiceNumber });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;