import { GlassCard } from '../components/ui/GlassCard';

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">Overview Dashboard</h1>
        <p className="text-slate-500 font-medium">Selamat datang kembali di SIMKEMAS.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm font-bold uppercase">Total Kemasan</span>
          <span className="text-4xl font-bold text-slate-800">1,240</span>
        </GlassCard>
        
        <GlassCard className="p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm font-bold uppercase">Pesanan Aktif</span>
          <span className="text-4xl font-bold text-primary">56</span>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm font-bold uppercase">Menunggu Review</span>
          <span className="text-4xl font-bold text-secondary">12</span>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="min-h-[300px]">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Aktivitas Terkini</h3>
        <div className="text-slate-400 text-center py-10 italic">
          Belum ada data aktivitas untuk ditampilkan.
        </div>
      </GlassCard>
    </div>
  );
};