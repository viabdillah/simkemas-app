import { motion } from 'framer-motion';
import { ShieldAlert, Lock, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export const AccountDisabledPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      
      {/* Background Animation (Floating Blobs) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none"
      />

      {/* Glass Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 bg-white/40 backdrop-blur-2xl border border-white/50 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
      >
        
        {/* Animated Icon */}
        <div className="relative inline-flex mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="p-4 bg-rose-100 rounded-2xl text-rose-500 shadow-inner"
          >
            <Lock size={48} strokeWidth={2.5} />
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
          >
            <ShieldAlert size={20} className="text-orange-500" />
          </motion.div>
        </div>

        <h1 className="text-2xl font-black text-slate-800 mb-2">Akses Ditangguhkan</h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Mohon maaf, akun Anda saat ini sedang dinonaktifkan oleh Administrator Sistem. 
          <br/><span className="text-xs text-slate-400 mt-2 block">Silakan hubungi tim IT atau Supervisor Anda untuk pemulihan akses.</span>
        </p>

        {/* Bouncy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Kembali ke Login
        </motion.button>

      </motion.div>
    </div>
  );
};