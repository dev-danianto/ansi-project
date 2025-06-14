import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * RouteGuard component to protect routes that require authentication
 * @param {Object} props - Component props
 * @param {string} props.redirectTo - Path to redirect to if authentication fails
 * @returns {JSX.Element} - Protected route component or redirect
 */
export const RouteGuard = ({ redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

/**
 * PublicOnlyRoute component to prevent authenticated users from accessing routes like login/signup
 * @param {Object} props - Component props
 * @param {string} props.redirectTo - Path to redirect to if user is already authenticated
 * @returns {JSX.Element} - Protected route component or redirect
 */
export const PublicOnlyRoute = ({ redirectTo = "/" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};
