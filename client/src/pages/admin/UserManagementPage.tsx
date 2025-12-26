import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { useToast } from '../../context/ToastContext';
import type { UserRole } from '../../types/auth'; 
// Import Icon Edit (Pensil), Check (Centang), X (Silang)
import { Search, Loader2, UserX, UserCheck, Edit2, Check, X } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  is_active: number;
}

export const UserManagementPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // State untuk Edit Nama
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('simkemas_token') || undefined;
      const data = await apiRequest<UserData[]>('/users', { token });
      setUsers(data);
    } catch (err) {
      addToast('Gagal memuat data user', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Edit Role & Status (Logic Lama)
  const handleUpdate = async (userId: string, newRole: string, newStatus: number) => {
    try {
      const token = localStorage.getItem('simkemas_token') || undefined;
      await apiRequest(`/users/${userId}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ role: newRole, is_active: newStatus })
      });
      addToast('Status/Role diperbarui!', 'success');
      fetchUsers();
    } catch (err) {
      addToast('Gagal update user', 'error');
    }
  };

  // [BARU] Fungsi Mulai Edit
  const startEdit = (user: UserData) => {
    setEditingId(user.id);
    setTempName(user.full_name);
  };

  // [BARU] Fungsi Simpan Nama
  const saveName = async (userId: string) => {
    try {
      const token = localStorage.getItem('simkemas_token') || undefined;
      await apiRequest(`/users/${userId}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ full_name: tempName }) // Kirim hanya nama
      });
      
      addToast('Nama berhasil diubah!', 'success');
      setEditingId(null); // Tutup mode edit
      fetchUsers(); // Refresh data
    } catch (err) {
      addToast('Gagal mengubah nama', 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search (Sama seperti sebelumnya) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Manajemen Pengguna</h1>
          <p className="text-slate-500 font-medium">Kontrol akses dan peran sistem.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari nama / email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <GlassCard key={user.id} className={`flex flex-col md:flex-row items-center justify-between p-4 gap-4 ${user.is_active === 0 ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              
              {/* User Info & Edit Name Section */}
              <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${user.is_active ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'}`}>
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                
                {/* Logic Switch: Mode Teks vs Mode Input */}
                <div className="flex-1 min-w-0">
                  {editingId === user.id ? (
                    // MODE EDIT: Tampilkan Input
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="border border-primary/50 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 outline-none w-full max-w-[200px]"
                        autoFocus
                      />
                      <button onClick={() => saveName(user.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer" title="Simpan">
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer" title="Batal">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    // MODE VIEW: Tampilkan Teks + Icon Edit
                    <div className="flex items-center gap-2 group">
                      <h3 className="font-bold text-slate-800 truncate cursor-default">{user.full_name}</h3>
                      <button 
                        onClick={() => startEdit(user)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary transition-all cursor-pointer"
                        title="Edit Nama"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">{user.username}</p>
                </div>
              </div>

              {/* Actions Controls (Dropdown & Toggle) */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select 
                  value={user.role}
                  onChange={(e) => handleUpdate(user.id, e.target.value, user.is_active)}
                  className="bg-white/50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none cursor-pointer"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="MANAJER">Manajer</option>
                  <option value="KASIR">Kasir</option>
                  <option value="DESAINER">Desainer</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="TAMU">Tamu</option>
                </select>

                <button
                  onClick={() => handleUpdate(user.id, user.role, user.is_active === 1 ? 0 : 1)}
                  className={`
                    p-2.5 rounded-lg border transition-all active:scale-95 flex items-center gap-2 text-sm font-bold cursor-pointer
                    ${user.is_active 
                      ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'}
                  `}
                  title={user.is_active ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                >
                  {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                  <span className="md:hidden">{user.is_active ? 'Nonaktifkan' : 'Aktifkan'}</span>
                </button>
              </div>

            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};