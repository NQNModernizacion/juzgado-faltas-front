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
//------------------------------------------------------------------------------------------------------------
// import { UserContext } from '@/context/UserWrapper'
// import { useContext } from 'react'
// import { Navigate, Outlet } from 'react-router-dom'

// interface ProtectedRouteProps {
//   children?: React.ReactNode
//   requireAuth?: boolean
//   onlyGuests?: boolean
//   requiredRoles?: string[]
//   requiredPermissions?: string[]
// }

// const ProtectedRoute = ({
//   children,
//   requireAuth = false,
//   onlyGuests = false,
//   requiredRoles = [],
//   requiredPermissions = [],
// }: ProtectedRouteProps) => {
//   const { actions: ua } = useContext(UserContext)
//   const user = ua.user()
// console.log("[ProtectedRoute]", {
//   requireAuth,
//   onlyGuests,
//   requiredRoles,
//   requiredPermissions,
//   user,
//   roles: user?.roles,
//   permissions: user?.permissions,
// });
//   // Verificar autenticación básica
//   if (requireAuth && !user) {
//     console.log("[ProtectedRoute]", {
//       requireAuth,
//       onlyGuests,
//       requiredRoles,
//       requiredPermissions,
//       user,
//       roles: user?.roles,
//       permissions: user?.permissions,
//     });
//     return <Navigate to="/login" />
  
//   }

//   // Verificar si el usuario es guest
//   if (onlyGuests && user) {
//     console.log("[ProtectedRoute]", {
//       requireAuth,
//       onlyGuests,
//       requiredRoles,
//       requiredPermissions,
//       user,
//       roles: user?.roles,
//       permissions: user?.permissions,
//     });
//     return <Navigate to="/" />
//   }


//   // Verificar roles
//   if (requiredRoles.length > 0) {
//     const hasRole = (r: string) => {
//       if (!user) return false
//       if (typeof ua.hasRole === 'function') {
//         try {
//           const res = ua.hasRole(r)
//           if (typeof res === 'boolean') {
//             if (res) return true
//             // si el helper devolvió false, caer al fallback
//           } else if (res) {
//             return true
//           }
//         } catch (e) {
//           // ignore y fallback
//         }
//       }
//       return (user.roles ?? []).some((userRole: any) =>
//         typeof userRole === 'string' ? userRole === r : userRole?.name === r
//       )
//     }

//     if (!requiredRoles.some(hasRole)) {
//       return <Navigate to="/" />
//     }
//   }

//   // Verificar permisos
//   if (requiredPermissions.length > 0) {
//     const hasPermission = (p: string) => {
//       if (!user) return false
//       if (typeof ua.hasPermission === 'function') {
//         try {
//           const res = ua.hasPermission(p)
//           if (typeof res === 'boolean') {
//             if (res) return true
//           } else if (res) {
//             return true
//           }
//         } catch (e) {
//           // ignore y fallback
//         }
//       }
//       return (user.permissions ?? []).some((userPermission: any) =>
//         typeof userPermission === 'string'
//           ? userPermission === p
//           : userPermission?.name === p
//       )
//     }

//     if (!requiredPermissions.every(hasPermission)) {
//       return <Navigate to="/" />
//     }
//   }

//   return <>{children ?? <Outlet />}</>
// }

// export default ProtectedRoute
// import { UserContext } from "@/context/UserWrapper";
// import { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// interface ProtectedRouteProps {
//   children?: React.ReactNode;
//   requireAuth?: boolean;
//   onlyGuests?: boolean;
//   requiredRoles?: string[];
//   requiredPermissions?: string[];
// }

// const ProtectedRoute = ({
//   children,
//   requireAuth = false,
//   onlyGuests = false,
//   requiredRoles = [],
//   requiredPermissions = [],
// }: ProtectedRouteProps) => {
//   const { actions: ua } = useContext(UserContext);

//   const user = ua.user();

//   // auth básica
//   if (requireAuth && !user) return <Navigate to="/login" />;
//   if (onlyGuests && user) return <Navigate to="/" />;

//   // roles: usar helper del store
//   if (requiredRoles.length > 0) {
//     const ok = requiredRoles.some((r) => ua.hasRole(r));
//     if (!ok) return <Navigate to="/" />;


//   }

//   // permisos: usar helper del store
//   if (requiredPermissions.length > 0) {
//     const ok = requiredPermissions.every((p) => ua.hasPermission(p));
//     if (!ok) return <Navigate to="/" />;
//   }

//   return <>{children ?? <Outlet />}</>;
// };

// export default ProtectedRoute;
