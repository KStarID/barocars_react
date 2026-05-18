import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  requireSeller?: boolean;
}

export default function ProtectedRoute({ requireSeller = false }: ProtectedRouteProps) {
  const { currentUser, isSeller, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requireSeller && !isSeller) {
    // Redirect to home if user is not a seller but route requires it
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
