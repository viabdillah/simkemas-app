DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id TEXT PRIMARY KEY,           -- Menggunakan NanoID/UUID (String)
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'TAMU', -- Validasi: 'SUPER_ADMIN', 'KASIR', dll
  created_at INTEGER DEFAULT (strftime('%s', 'now')), -- Unix Timestamp
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Seed Data (Akun Super Admin Pertama)
-- Password default: 'admin123' (Hash ini hanya contoh, nanti kita generate yang valid via bcrypt)
INSERT INTO users (id, username, full_name, password_hash, role) 
VALUES ('user_001', 'admin', 'Super Admin System', '$2a$10$YourHashedPasswordHere', 'SUPER_ADMIN');