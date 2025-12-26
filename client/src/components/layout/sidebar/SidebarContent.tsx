import { Package, LogOut, X } from 'lucide-react';
import { MenuList } from './MenuList';
import type { UserRole } from '../../../types/auth';

interface SidebarContentProps {
  userRole: UserRole;
  username: string; // [BARU] Terima prop username
  onLogout: () => void;
  onClose?: () => void;
}

export const SidebarContent = ({ userRole, username, onLogout, onClose }: SidebarContentProps) => {
  
  // Helper: Ambil inisial nama untuk Avatar (Misal: "Admin System" -> "A")
  const initial = username.charAt(0).toUpperCase();

  // Helper: Format tampilan Role agar lebih rapi (SUPER_ADMIN -> Super Admin)
  const formattedRole = userRole.replace('_', ' ');

  return (
    <div className="h-full flex flex-col bg-white/60 backdrop-blur-2xl border border-white/50 md:rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Package size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight leading-none">SIMKEMAS</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-0.5">Edition .cyou</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full cursor-pointer">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Menu List */}
      <MenuList userRole={userRole} />

      {/* Footer: User Profile & Logout */}
      <div className="p-4 border-t border-white/30 bg-white/40">
        
        {/* Profile Card */}
        <div className="flex items-center gap-3 mb-4 px-2">
          {/* Avatar Gradient */}
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
            {initial}
          </div>
          
          {/* Info User */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate leading-tight" title={username}>
              {username}
            </p>
            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full inline-block mt-1">
              {formattedRole}
            </span>
          </div>
        </div>

        {/* Logout Button (Compact) */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <LogOut size={16} />
          Keluar Sistem
        </button>
      </div>

    </div>
  );
};