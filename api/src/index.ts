import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';

// Import Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import customerRoutes from './routes/customers';

const app = new Hono<{ Bindings: Bindings }>();

// [PERBAIKAN DISINI] Tambahkan 'DELETE' ke allowMethods
app.use('/*', cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'], // <-- Pastikan DELETE ada
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => c.text('SIMKEMAS API Modular 🚀'));

// Mounting Routes
app.route('/auth', authRoutes);
app.route('/users', userRoutes);
app.route('/customers', customerRoutes);

export default app;