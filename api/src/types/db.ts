export type UserRole = 'SUPER_ADMIN' | 'KASIR' | 'DESAINER' | 'OPERATOR' | 'MANAJER' | 'TAMU';

export interface User {
  id: string;
  username: string;
  full_name: string;
  password_hash: string;
  role: UserRole;
  created_at: number;
  updated_at: number;
}