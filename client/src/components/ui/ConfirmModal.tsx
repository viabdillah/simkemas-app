import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean; // Warna merah jika aksi berbahaya (Hapus)
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  isDanger = false,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. BACKDROP (Gelap & Blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            {/* 2. MODAL CONTENT */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Agar klik di card tidak menutup modal
              className="bg-white/90 border border-white/50 shadow-2xl rounded-2xl p-6 max-w-sm w-full relative overflow-hidden"
            >
              {/* Icon Background Decoration */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 pointer-events-none ${isDanger ? 'bg-rose-500' : 'bg-primary'}`} />

              <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                
                {/* Icon Circle */}
                <div className={`p-4 rounded-full ${isDanger ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                  <AlertTriangle size={32} />
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full pt-2">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    {cancelLabel}
                  </button>
                  
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`
                      flex-1 py-2.5 px-4 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2
                      ${isDanger 
                        ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' 
                        : 'bg-primary hover:bg-primary/90 shadow-blue-500/30'}
                    `}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};