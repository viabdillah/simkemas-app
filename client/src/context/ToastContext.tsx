import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Tipe data Toast
export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove setelah 4 detik
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Container Toast Floating */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Sub-component UI untuk Toast (Fixed Contrast & Visibility)
const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  // CONFIG WARNA (FIXED: Dibuat lebih gelap dan tanpa dark mode)
  const colors = {
    success: 'bg-emerald-100/90 border-emerald-500 text-emerald-900',
    error:   'bg-rose-100/90 border-rose-500 text-rose-900',
    info:    'bg-blue-100/90 border-blue-500 text-blue-900',
  };

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    error:   <AlertCircle className="w-6 h-6 text-rose-600" />,
    info:    <Info className="w-6 h-6 text-blue-600" />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        pointer-events-auto 
        relative overflow-hidden
        backdrop-blur-md 
        border-l-4 border-y border-r border-white/50
        shadow-xl shadow-slate-500/10
        p-4 rounded-xl 
        flex items-start gap-4 
        w-80 max-w-md
        ${colors[toast.type]}
      `}
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      
      <div className="flex-1">
        {/* Title bisa ditambahkan jika perlu, sekarang kita fokus message */}
        <p className="font-semibold text-sm leading-tight pr-2">
          {toast.message}
        </p>
      </div>

      <button 
        onClick={onClose} 
        className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors cursor-pointer text-current opacity-60 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress Bar Decor */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 bg-current opacity-20`}
      />
    </motion.div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};