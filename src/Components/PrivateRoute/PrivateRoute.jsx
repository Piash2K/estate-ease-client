/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';


const PrivateRoute = ({children, allowedRoles}) => {
    const {user, userRole, roleLoading}= useContext(AuthContext);
    const location = useLocation();

    if (roleLoading) {
        return null;
    }
    
    if(user){
        if (allowedRoles?.length && !allowedRoles.includes(userRole)) {
            const fallbackPath = userRole === 'admin' || userRole === 'manager'
                ? '/dashboard/admin-profile'
                : '/dashboard/my-profile';

            return <Navigate to={fallbackPath} replace></Navigate>;
        }

        return children;
    }
    return (
        <Navigate to='/login' state={{ from: location }} replace></Navigate>
    );
};

export default PrivateRoute;