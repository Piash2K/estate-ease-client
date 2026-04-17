import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Provider/AuthProvider';

const DashboardIndexRedirect = () => {
  const { userRole } = useContext(AuthContext);

  if (userRole === 'admin' || userRole === 'manager') {
    return <Navigate to="/dashboard/admin-profile" replace />;
  }

  return <Navigate to="/dashboard/my-profile" replace />;
};

export default DashboardIndexRedirect;
