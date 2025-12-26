import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PrivateRoute } from './guards/PrivateRoute';
import { PublicRoute } from './guards/PublicRoute';

// Import Modules
import { AdminRoutes } from './modules/AdminRoutes';
import { CashierRoutes } from './modules/CashierRoutes';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public: Login */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      {/* Private: Dashboard Layout */}
      <Route path="/" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<DashboardPage />} />
        
        {/* === MODULAR ROUTES === */}
        {AdminRoutes}
        {CashierRoutes}
        
        {/* Placeholder Lain */}
        <Route path="kemasan" element={<div>Manajemen Kemasan</div>} />
        <Route path="settings" element={<div>Pengaturan</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};