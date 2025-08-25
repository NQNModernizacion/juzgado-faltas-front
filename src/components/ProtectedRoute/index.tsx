import { UserContext } from '@/context/UserWrapper'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  children?: React.ReactNode
  requireAuth?: boolean
  onlyGuests?: boolean
  requiredRoles?: string[]
  requiredPermissions?: string[]
}

const ProtectedRoute = ({
  children,
  requireAuth = false,
  onlyGuests = false,
  requiredRoles = [],
  requiredPermissions = [],
}: ProtectedRouteProps) => {
  const { actions: ua } = useContext(UserContext)
  const user = ua.user()

  // Verificar autenticación básica
  if (requireAuth && !user) {
    return <Navigate to="/login" />
  }

  // Verificar si el usuario es guest
  if (onlyGuests && user) {
    return <Navigate to="/" />
  }

  // Verificar roles
  if (
    requiredRoles.length > 0 &&
    (!user ||
      !requiredRoles.some((role) =>
        user.roles.some((userRole) => userRole.name === role)
      ))
  ) {
    return <Navigate to="/" />
  }

  // Verificar permisos
  if (
    requiredPermissions.length > 0 &&
    (!user ||
      !requiredPermissions.every((permission) =>
        user.permissions.some(
          (userPermission) => userPermission.name === permission
        )
      ))
  ) {
    return <Navigate to="/" />
  }

  return <>{children ?? <Outlet />}</>
}

export default ProtectedRoute
