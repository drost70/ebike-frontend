import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/useStore';

export default function ProtectedRoute() {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}