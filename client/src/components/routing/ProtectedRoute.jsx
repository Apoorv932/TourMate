import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const { isLoggedIn, user, status } = useSelector((state) => state.auth);

  if (status === 'loading') {
    return <p className="p-8 text-center text-gray-600">Loading...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
