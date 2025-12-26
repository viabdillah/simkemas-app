import { Navigate } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { auth } from '../../lib/firebase'; // Path mundur 2 langkah ke lib
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};