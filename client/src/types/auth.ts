// 1. Definisi Role Pengguna (Sesuai Aturan RBAC)
export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'KASIR' 
  | 'DESAINER' 
  | 'OPERATOR' 
  | 'MANAJER' 
  | 'TAMU';

// 2. Interface User Basic
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

// 3. Payload untuk PASETO Token
export interface AuthPayload {
  sub: string; // User ID
  role: UserRole;
  exp: number; // Expiration time
}