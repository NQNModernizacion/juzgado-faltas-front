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
import { AltaActa } from '@/screens/Acta/AltaActa'
import { ListadoActas } from '@/screens/Acta/ListadoActas'

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
          <Route path="/acta/alta" element={<AltaActa />} />
          <Route path="/acta/listado" element={<ListadoActas />} />
          <Route
          
            path="/admin"
            element={
               <ProtectedRoute
                 requiredRoles={['admin']}
                 requiredPermissions={['admin.permission.view']}

              >
                <PanelAdmin />
               </ProtectedRoute>
            }
          />

         <Route path="/_viewcom" element={<DevScreen />} />
          {/* <Route
  path="/_viewcom"
  element={
     <ProtectedRoute requiredRoles={['admin.permisos']}>
      <DevScreen />
     </ProtectedRoute>
  }
/> */}

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
