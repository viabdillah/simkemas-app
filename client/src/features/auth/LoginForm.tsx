import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { useToast } from '../../context/ToastContext';
import { apiRequest } from '../../lib/api';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const LoginForm = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Login ke Firebase (Client Side)
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      
      // 2. Ambil ID Token terbaru
      const token = await firebaseUser.getIdToken();

      // 3. Kirim Token ke Backend Cloudflare Workers
      // Backend akan mengecek apakah akun aktif atau diblokir
      const serverData = await apiRequest<{ role: string, username: string }>('/auth/sync', {
        method: 'POST',
        token: token
      });

      // 4. Login Sukses: Simpan Session
      localStorage.setItem('simkemas_token', token);
      localStorage.setItem('simkemas_role', serverData.role);

      localStorage.setItem('simkemas_username', serverData.username || 'User');

      addToast(`Selamat Datang, ${serverData.username || 'User'}!`, 'success');

      // 5. Redirect ke Dashboard
      navigate('/', { replace: true });

    } catch (error: any) {
      console.error("Login Error:", error);

      // HANDLING KHUSUS: AKUN DINONAKTIFKAN
      if (error.message && error.message.includes('ACCOUNT_DISABLED')) {
        // Logout dari firebase agar session bersih
        await auth.signOut();
        localStorage.clear();
        // Lempar ke halaman aesthetic "Access Denied"
        navigate('/deactivated', { replace: true });
        return;
      }

      // Handling Error Umum (Firebase / Network)
      let msg = error.message;
      if (error.code === 'auth/invalid-credential' || error.message.includes('400')) {
         msg = "Email atau Password salah. Silakan coba lagi.";
      } else if (error.code === 'auth/too-many-requests') {
         msg = "Terlalu banyak percobaan login. Silakan tunggu beberapa saat.";
      }

      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto relative overflow-hidden">
      
      {/* Decorative Icon Background */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Lock size={64} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Masuk Sistem</h2>
        <p className="text-slate-500 text-sm">Masukkan kredensial Anda untuk melanjutkan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Input Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="
                w-full pl-10 pr-4 py-3 
                bg-white/40 border border-white/60 
                rounded-xl outline-none 
                focus:bg-white/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 
                transition-all duration-300 placeholder:text-slate-400
              "
              placeholder="nama@simkemas.cyou"
            />
          </div>
        </div>

        {/* Input Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-secondary transition-colors" />
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="
                w-full pl-10 pr-4 py-3 
                bg-white/40 border border-white/60 
                rounded-xl outline-none 
                focus:bg-white/60 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 
                transition-all duration-300 placeholder:text-slate-400
              "
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-3.5 px-4 mt-4
            bg-linear-to-r from-primary to-secondary 
            text-white font-bold text-lg rounded-xl 
            shadow-lg shadow-blue-500/30 
            hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 
            disabled:opacity-70 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Verifikasi...
            </>
          ) : (
            <>
              Masuk System <ArrowRight size={20} />
            </>
          )}
        </button>

      </form>
    </GlassCard>
  );
};