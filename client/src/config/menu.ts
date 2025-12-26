import { LayoutDashboard, Box, Users, Settings, User, ShoppingBag } from 'lucide-react';
import type { UserRole } from '../types/auth'; // Import tipe role

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  allowedRoles?: UserRole[]; // Array role yang diizinkan
}

export const MENU_ITEMS: MenuItem[] = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/' 
    // Tidak ada allowedRoles = Semua bisa akses
  },
  { 
    icon: User, // Atau ganti icon 'Users'
    label: 'Database Pelanggan', // Ganti label agar lebih umum
    path: '/cashier/customers', // Arahkan ke LIST, bukan entry
    allowedRoles: ['SUPER_ADMIN', 'KASIR', 'OPERATOR'] 
  },
  { 
    icon: ShoppingBag, 
    label: 'Buat Pesanan', 
    path: '/cashier/new-order',
    allowedRoles: ['SUPER_ADMIN', 'KASIR'] 
  },
  { 
    icon: Box, 
    label: 'Manajemen Kemasan', 
    path: '/kemasan',
    // Contoh: Tamu tidak boleh lihat data kemasan (Opsional)
    allowedRoles: ['SUPER_ADMIN', 'MANAJER', 'KASIR', 'DESAINER', 'OPERATOR'] 
  },
  { 
    icon: Users, 
    label: 'Data Pengguna', 
    path: '/users',
    // HANYA UNTUK ADMIN & MANAJER
    allowedRoles: ['SUPER_ADMIN', 'MANAJER'] 
  },
  { 
    icon: Settings, 
    label: 'Pengaturan', 
    path: '/settings' 
  },
];