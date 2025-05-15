import { Outlet } from "react-router-dom";
import { UserRole } from "../types/auth";
import { useSelector } from "react-redux";

interface ProtectedProps {
    requiredRole: UserRole,    
};

export const Protected = ({ requiredRole }: ProtectedProps) => {

    const auth = useSelector((state) => state);

// Authorize will be implement here
    return <Outlet />;
}