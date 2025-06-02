import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../types/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ProtectedProps {
    requiredRole?: UserRole,    
};

const rolePermissions = {
    ADMIN: ["/home", 
            "/manage-user", "/manage-user/create", "/manage-user/edit/:id",
            "/manage-asset", "/manage-asset/create", "/manage-asset/edit/:id",
            "/manage-assignment", 
            "/request-return", 
            "/report"],
    STAFF: ["/home"]
}

const Protected = ({ requiredRole }: ProtectedProps) => {

    const auth = useSelector((state: RootState) => state.auth);

    if(!auth.role) {
        return <Navigate to="/login" replace />
    }

    const allowedRoutes = rolePermissions[auth.role];
    const currentPath = window.location.pathname;

    if(requiredRole && auth.role !== requiredRole) {
        return <Navigate to="/login" />
    }

    if(!allowedRoutes.includes(currentPath)) {
        return <Navigate to="/login" />
    }
    
    return <Outlet />;
};

export default Protected;
