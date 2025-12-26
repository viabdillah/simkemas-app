import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { Search, UserPlus, ChevronRight } from 'lucide-react'; // Hapus 'User'

// Definisi Tipe Data Customer
interface Customer {
  id: string;
  name: string;
  whatsapp: string;
}

export const CustomerListPage = () => {
  const navigate = useNavigate();
  // Gunakan Tipe Customer[]
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Beri tahu apiRequest bahwa balikkannya adalah array Customer
        const data = await apiRequest<Customer[]>(`/customers?q=${search}`, {
          token: localStorage.getItem('simkemas_token') || undefined
        });
        setCustomers(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Daftar Pelanggan</h1>
          <p className="text-slate-500 font-medium">Kelola data pelanggan dan produk mereka.</p>
        </div>
        <button 
          onClick={() => navigate('/cashier/customer-entry')}
          className="bg-primary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          <UserPlus size={18} /> Pelanggan Baru
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama atau no WA..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid gap-3">
        {customers.map((c) => (
          <GlassCard 
            key={c.id} 
            // Sekarang onClick valid karena GlassCard sudah diupdate
            onClick={() => navigate(`/cashier/customers/${c.id}`)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-tr from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{c.name}</h3>
                <p className="text-sm text-slate-500">{c.whatsapp}</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-primary" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
};