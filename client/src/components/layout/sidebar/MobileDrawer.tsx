import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const MobileDrawer = ({ isOpen, onClose, children }: MobileDrawerProps) => {
  // Logic Animasi: Mobile (Slide Up) vs Tablet (Slide Right)
  const isMobile = window.innerWidth < 768;

  const variants = {
    hidden: isMobile ? { y: "100%" } : { x: "-100%" },
    visible: isMobile ? { y: 0 } : { x: 0 },
    exit: isMobile ? { y: "100%" } : { x: "-100%" }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Layar Gelap) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Drawer Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`
              fixed z-[60] 
              /* Mobile: Bottom Sheet */
              bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl
              /* Tablet: Side Drawer */
              md:top-0 md:left-0 md:h-full md:w-80 md:rounded-none md:rounded-r-3xl
              /* Desktop: Hidden */
              lg:hidden
            `}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};