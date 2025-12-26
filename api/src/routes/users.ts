import { Hono } from 'hono';
import { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

// Get All Users
app.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, username, full_name, role, is_active FROM users ORDER BY created_at DESC'
    ).all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Update User
app.patch('/:id', async (c) => {
  const userId = c.req.param('id');
  const body = await c.req.json();
  const updates: string[] = [];
  const values: any[] = [];

  if (body.role !== undefined) { updates.push("role = ?"); values.push(body.role); }
  if (body.is_active !== undefined) { updates.push("is_active = ?"); values.push(body.is_active); }
  if (body.full_name !== undefined) { updates.push("full_name = ?"); values.push(body.full_name); }

  if (updates.length === 0) return c.json({ error: "Tidak ada data update" }, 400);

  values.push(userId);
  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

  try {
    await c.env.DB.prepare(sql).bind(...values).run();
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;