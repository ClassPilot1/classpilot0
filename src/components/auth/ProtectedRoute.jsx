/**
 * Protected Route Component / Qaybta Waddada La Ilaaliyey
 * Protects routes that require authentication
 * Wuxuu ilaaliyaa waddooyinka u baahan xaqiijinta
 */
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requireAuth }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  /**
   * Show loading state while checking authentication
   * Muuji xaaladda socodka marka la hubinayo xaqiijinta
   */
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  /**
   * If route requires authentication and user is not authenticated, redirect to login
   * Haddii waddadu u baahato xaqiijinta oo isticmaaluhu aan xaqiijin, u wadaa login
   */
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * If route requires unauthenticated user and user is authenticated, redirect to main page
   * Haddii waddadu u baahato isticmaale aan xaqiijin oo isticmaaluhu xaqiijiyey, u wadaa bogga ugu weyn
   */
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Otherwise, render the children
   * Haddii kale, soo bandhig carruurta
   */
  return children;
};

export default ProtectedRoute;