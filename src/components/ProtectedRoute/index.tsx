import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  onlyGuests?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

const ProtectedRoute = ({
  children,
  requireAuth = false,
  onlyGuests = false,
  requiredRoles = [],
  requiredPermissions = [],
}: ProtectedRouteProps) => {
  const hydrated = useSessionStore((s) => s.hydrated);
  const token = useSessionStore((s) => s.token);
  const user = useSessionStore((s) => s.user);
  const hasRole = useSessionStore((s) => s.hasRole);
  const hasPermission = useSessionStore((s) => s.hasPermission);

  if (!hydrated) {
    return null;
  }

  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }

  if (onlyGuests && token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles.length > 0) {
    const ok = requiredRoles.some((role) => hasRole(role));
    if (!ok) return <Navigate to="/" replace />;
  }

  if (requiredPermissions.length > 0) {
    const ok = requiredPermissions.every((permission) =>
      hasPermission(permission)
    );
    if (!ok) return <Navigate to="/" replace />;
  }

  return <>{children ?? <Outlet />}</>;
};

export default ProtectedRoute;
