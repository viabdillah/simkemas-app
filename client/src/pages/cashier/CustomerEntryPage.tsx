import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // [1. IMPORT INI]
import { apiRequest } from '../../lib/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { useToast } from '../../context/ToastContext';
import { User, Phone, MapPin, Mail, Save, Loader2 } from 'lucide-react';
import { toTitleCase } from '../../lib/formatters';

export const CustomerEntryPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate(); // [2. INISIALISASI HOOK]
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'name' || name === 'address') {
      finalValue = toTitleCase(value);
    }

    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest('/customers', {
        method: 'POST',
        token: localStorage.getItem('simkemas_token') || undefined,
        body: JSON.stringify(formData)
      });
      
      addToast('Pelanggan berhasil didaftarkan!', 'success');
      
      // [3. REDIRECT KE DATABASE CUSTOMER]
      navigate('/cashier/customers'); 

    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Class reusable (UI/UX Hover Keren)
  const inputClass = `
    w-full px-4 py-3.5 
    bg-white/40 border border-white/60 backdrop-blur-sm
    rounded-2xl outline-none 
    transition-all duration-300 ease-out
    placeholder:text-slate-400 text-slate-700 font-medium
    hover:bg-white/60 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5
    focus:bg-white/80 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:shadow-xl focus:shadow-primary/10
  `;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-[fadeIn_0.6s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Registrasi Pelanggan</h1>
          <p className="text-slate-500 font-medium mt-1">Data awal untuk memulai transaksi baru.</p>
        </div>
        <div className="hidden md:block p-3 bg-primary/10 text-primary rounded-2xl">
          <User size={32} />
        </div>
      </div>

      <GlassCard className="p-8 md:p-10 border-t-4 border-t-primary/80 !shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Identitas Personal */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Identitas Personal
            </h3>
            
            <div className="space-y-2 group">
              <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-primary transition-colors">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>
          </div>

          {/* Section: Kontak & Alamat */}
          <div className="space-y-6">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Kontak & Alamat
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="space-y-2 group">
                <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-emerald-600 transition-colors">
                  No. WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className={`${inputClass} pl-12 focus:!border-emerald-500/50 focus:!ring-emerald-500/10 hover:shadow-emerald-500/10`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-blue-600 transition-colors">
                  Email (Opsional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@contoh.com"
                    className={`${inputClass} pl-12 focus:!border-blue-500/50 focus:!ring-blue-500/10 hover:shadow-blue-500/10`}
                  />
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-2 group">
              <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-rose-500 transition-colors">
                Alamat Lengkap
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nama jalan, nomor rumah, kecamatan..."
                  className={`${inputClass} pl-12 resize-none focus:!border-rose-500/50 focus:!ring-rose-500/10 hover:shadow-rose-500/10`}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-4 
                bg-linear-to-r from-emerald-500 to-teal-600 
                text-white font-bold text-lg rounded-2xl 
                shadow-lg shadow-emerald-500/30 
                hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-[1.02] hover:-translate-y-1
                active:scale-95 active:translate-y-0
                transition-all duration-300 ease-out
                flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} /> 
                  Simpan Data Pelanggan
                </>
              )}
            </button>
          </div>

        </form>
      </GlassCard>
    </div>
  );
};