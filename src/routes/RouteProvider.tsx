import { HashRouter, Routes, Route } from 'react-router-dom'
import Sandbox from '@/screens/Sandbox'
import Menu from '@/screens/Menu'
import PanelAdmin from '@/screens/PanelAdmin'
import DevScreen from '@/screens/_DevScreen'
import Login from '@/screens/Login'
import NotFound from '@/components/NotFound'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserLayout from '@/components/Layouts/UserLayout'
import GuestLayout from '@/components/Layouts/GuestLayout'

const RouteProvider = () => {
  return (
    <HashRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      {/* Sacar atributo future cuando se actualice a react-router-dom v7 */}
      <Routes>
        <Route
          path="*"
          element={
            <GuestLayout>
              <NotFound />
            </GuestLayout>
          }
        />

        <Route
          element={
            <ProtectedRoute requireAuth>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Menu />} />

          <Route path="/sandbox" element={<Sandbox />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                requiredRoles={['admin.permisos']}
                // requiredPermissions={['permiso.prueba']}
              >
                <PanelAdmin />
              </ProtectedRoute>
            }
          />

          {__DEV__ && <Route path="/_viewcom" element={<DevScreen />} />}
        </Route>

        <Route
          element={
            <ProtectedRoute onlyGuests>
              <GuestLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default RouteProvider
