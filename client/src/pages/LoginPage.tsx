import { Package } from 'lucide-react';
import { LoginForm } from '../features/auth/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      
      {/* Background Decor (Blob) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

      {/* Header Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-white/30 backdrop-blur-md mb-4 shadow-sm border border-white/50">
          <Package className="w-10 h-10 text-slate-800" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          SIMKEMAS
        </h1>
        <p className="text-slate-500 font-medium mt-2">Sistem Informasi Manajemen Kemasan</p>
      </div>

      {/* Form Section */}
      <LoginForm />

      {/* Footer */}
      <p className="text-center text-slate-400 text-xs mt-12">
        &copy; {new Date().getFullYear()} SIMKEMAS Edition. Secure PASETO Auth.
      </p>
    </div>
  );
};