import { Route } from 'react-router-dom';
import { RoleGuard } from '../guards/RoleGuard';
import { UserManagementPage } from '../../pages/admin/UserManagementPage';

export const AdminRoutes = (
  <Route path="users" element={
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'MANAJER']}>
      <UserManagementPage />
    </RoleGuard>
  } />
);