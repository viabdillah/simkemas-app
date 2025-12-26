import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <Sidebar />

      {/* Main Content Area 
         - Mobile/Tablet: Padding standard (px-4)
         - Desktop (lg): Padding kiri besar (pl-[290px]) untuk akomodasi Sidebar statis
      */}
      <main className="w-full lg:pl-[290px] px-4 py-6 md:py-8 min-h-screen transition-all duration-300">
        <div className="min-h-[calc(100vh-4rem)] animate-[fadeIn_0.5s_ease-out]">
          {/* Header Spacer untuk Tablet agar tidak tertutup Hamburger Menu */}
          <div className="h-12 md:h-16 lg:hidden" /> 
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};