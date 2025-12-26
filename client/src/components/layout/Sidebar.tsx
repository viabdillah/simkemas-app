import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import type { UserRole } from '../../types/auth';

// Import Komponen Pecahan
import { SidebarContent } from './sidebar/SidebarContent';
import { MobileDrawer } from './sidebar/MobileDrawer';

export const Sidebar = () => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // 1. Ambil Data User dari LocalStorage
  // Data ini disimpan saat login berhasil di LoginForm.tsx
  const userRole = localStorage.getItem('simkemas_role') as UserRole || 'TAMU';
  const username = localStorage.getItem('simkemas_username') || 'Pengguna';

  // 2. Auto-close drawer saat pindah halaman (UX Mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // 3. Handle Logout Logic
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // Hapus token, role, dan username
      addToast('Anda telah keluar dari sistem.', 'info');
      // Redirect akan dihandle otomatis oleh Router (PublicRoute/PrivateRoute)
    } catch (error) {
      addToast('Gagal logout.', 'error');
    }
  };

  return (
    <>
      {/* A. DESKTOP SIDEBAR (Static) 
          - Hanya muncul di layar besar (lg:flex)
          - Posisi fixed di kiri
      */}
      <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 w-64 flex-col z-50">
        <SidebarContent 
          userRole={userRole} 
          username={username} 
          onLogout={handleLogout} 
        />
      </aside>

      {/* B. TOGGLE BUTTONS (Hamburger & FAB) */}
      
      {/* 1. Tablet Toggle (Top Left) 
          - Muncul di layar menengah (md:block) tapi hilang di desktop (lg:hidden)
      */}
      <div className="hidden md:block lg:hidden fixed top-6 left-6 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-3 bg-white/80 backdrop-blur-md border border-white/50 rounded-xl shadow-lg text-slate-700 hover:text-primary transition-all active:scale-95 cursor-pointer"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 2. Mobile Toggle (Bottom Right FAB) 
          - Hanya muncul di layar kecil (md:hidden)
          - Mengambang di kanan bawah
      */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-4 bg-linear-to-r from-primary to-secondary text-white rounded-full shadow-lg shadow-blue-500/40 hover:scale-110 transition-all active:scale-95 cursor-pointer"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* C. MOBILE/TABLET DRAWER (Animated Overlay) 
          - Menangani animasi slide-up (mobile) atau slide-right (tablet)
      */}
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SidebarContent 
          userRole={userRole} 
          username={username}
          onLogout={handleLogout} 
          onClose={() => setIsOpen(false)} 
        />
      </MobileDrawer>
    </>
  );
};