import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../types/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ProtectedProps {
    requiredRole?: UserRole,    
};

const rolePermissions = {
    ADMIN: ["/home", 
            "/manage-user", "/manage-user/create", "/manage-user/edit/",
            "/manage-asset", "/manage-asset/create", "/manage-asset/edit/",
            "/manage-assignment", "/manage-assignment/create", 
            "/request-return", 
            "/report"],
    STAFF: ["/home"]
}

const Protected = ({ requiredRole }: ProtectedProps) => {

    const auth = useSelector((state: RootState) => state.auth);
    const currentPath = window.location.pathname;

    if(!auth.role) {
        return <Navigate to="/login" replace />
    }

    if(requiredRole && auth.role !== requiredRole) {
        return <Navigate to="/login" />
    }

    const allowedRoutes = rolePermissions[auth.role];

    const isAllowed = allowedRoutes.some((route) => {
        if (route.endsWith("/")) {
            return currentPath.startsWith(route);
        }
        return currentPath === route;
    });

    if(!isAllowed) {
        return <Navigate to="/login" />
    }
    
    return <Outlet />;
};

export default Protected;
