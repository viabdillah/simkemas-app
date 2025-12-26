// Ganti import biasa dengan 'import type'
import type { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = '', ...props }: GlassCardProps) => {
  return (
    <div 
      className={`bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl ${className}`}
      {...props} 
    >
      {children}
    </div>
  );
};