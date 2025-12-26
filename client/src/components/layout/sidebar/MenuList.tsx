import { NavLink } from 'react-router-dom';
import { MENU_ITEMS } from '../../../config/menu';
import type { UserRole } from '../../../types/auth';

interface MenuListProps {
  userRole: UserRole; // Menerima props userRole
}

export const MenuList = ({ userRole }: MenuListProps) => {
  // Logic Filter: Filter menu berdasarkan role
  const filteredMenu = MENU_ITEMS.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole);
  });

  return (
    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
      {filteredMenu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
            ${isActive 
              ? 'bg-linear-to-r from-primary to-secondary text-white shadow-lg shadow-blue-500/20' 
              : 'text-slate-600 hover:bg-white/50 hover:text-primary'}
          `}
        >
          <item.icon size={20} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};