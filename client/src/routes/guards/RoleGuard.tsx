import { Navigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import type { UserRole } from '../../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { addToast } = useToast();
  const userRole = localStorage.getItem('simkemas_role') as UserRole || 'TAMU';

  // Cek apakah role user ada di daftar yang diizinkan
  if (!allowedRoles.includes(userRole)) {
    // Cegah loop notifikasi jika dirender berulang
    // addToast('Akses ditolak: Anda tidak memiliki izin.', 'error'); 
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};