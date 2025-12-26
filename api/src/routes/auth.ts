import { Hono } from 'hono';
import { verifyFirebaseToken } from '../lib/firebase-auth';
import { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

app.post('/sync', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Token tidak ditemukan' }, 401);
  
  const token = authHeader.split(' ')[1];
  const userData = await verifyFirebaseToken(token, c.env.FIREBASE_PROJECT_ID);
  
  if (!userData) return c.json({ error: 'Token tidak valid' }, 401);

  const { uid, email } = userData;

  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(uid).all();
    let userRole = 'TAMU';
    let isActive = 1;

    if (results.length === 0) {
      await c.env.DB.prepare(`
        INSERT INTO users (id, username, full_name, password_hash, role, is_active) 
        VALUES (?, ?, ?, ?, ?, 1)
      `).bind(uid, email?.split('@')[0] || 'user', email || 'No Name', 'firebase-managed', 'TAMU').run();
    } else {
      userRole = results[0].role as string;
      isActive = results[0].is_active as number;
    }

    if (isActive === 0) return c.json({ error: 'ACCOUNT_DISABLED' }, 403);

    return c.json({ message: 'Sync Berhasil', role: userRole, username: email });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;