import useAuthStore from '@/store/auth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {

    const { logged } = useAuthStore();

    return (
        logged ? (
            <Outlet />
        ) : (
            <Navigate to="/login" replace/>
        )
    );
}

export default PrivateRoute;
