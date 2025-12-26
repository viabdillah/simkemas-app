import { Route } from 'react-router-dom';
import { RoleGuard } from '../guards/RoleGuard';
import { CustomerEntryPage } from '../../pages/cashier/CustomerEntryPage';
import { CustomerListPage } from '../../pages/cashier/CustomerListPage'; // Import Baru
import { CustomerDetailPage } from '../../pages/cashier/CustomerDetailPage'; // Import Baru
import { NewOrderPage } from '../../pages/cashier/NewOrderPage';

export const CashierRoutes = (
  <Route path="cashier">
    
    {/* 1. Halaman Input Pelanggan (Entry) */}
    <Route path="customer-entry" element={
      <RoleGuard allowedRoles={['SUPER_ADMIN', 'KASIR']}>
        <CustomerEntryPage />
      </RoleGuard>
    } />

    {/* 2. Halaman Daftar Pelanggan (List) */}
    <Route path="customers" element={
      <RoleGuard allowedRoles={['SUPER_ADMIN', 'KASIR']}>
        <CustomerListPage />
      </RoleGuard>
    } />

    {/* 3. Halaman Detail Pelanggan (Detail + Produk) */}
    <Route path="customers/:id" element={
      <RoleGuard allowedRoles={['SUPER_ADMIN', 'KASIR']}>
        <CustomerDetailPage />
      </RoleGuard>
    } />

    <Route path="new-order" element={
      <RoleGuard allowedRoles={['SUPER_ADMIN', 'KASIR']}>
        <NewOrderPage />
      </RoleGuard>
    } />

  </Route>
);