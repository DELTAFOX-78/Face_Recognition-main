import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'student' | 'teacher';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/${role}/login`} state={{ from: location }} replace />;
  }

  if (userRole !== role) {
    return <Navigate to={`/${userRole}/login`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;