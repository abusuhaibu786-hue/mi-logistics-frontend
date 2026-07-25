import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

export function ProtectedRoute() {
  const { isAuth, checkingSession } = useAuth();
  if (checkingSession) return null;
  if (!isAuth) return <Navigate to="/login" replace />;
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export function PublicRoute() {
  const { isAuth, checkingSession } = useAuth();
  if (checkingSession) return null;
  if (isAuth) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
