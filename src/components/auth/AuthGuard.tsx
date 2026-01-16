import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

interface AuthGuardProps {
  children: ReactNode;
  role?: 'student' | 'teacher';
}

const AuthGuard = ({ children, role }: AuthGuardProps) => {
  const { isAuthenticated, userRole, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateAuth = async () => {
      const isValid = await checkAuth();
      
      if (!isValid) {
        // Store the attempted URL to redirect back after login
        navigate(`/${role || 'student'}/login`, { 
          replace: true,
          state: { from: location }
        });
        return;
      }

      // If role is specified and doesn't match, redirect to appropriate dashboard
      if (role && userRole && userRole !== role) {
        navigate(`/${userRole}/dashboard`, { replace: true });
      }
    };

    validateAuth();
  }, [checkAuth, isAuthenticated, userRole, role, navigate, location]);

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default AuthGuard;