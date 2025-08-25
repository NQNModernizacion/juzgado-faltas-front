import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import Logout from '@/components/Svgs/Logout'
import { UserContext } from '@/context/UserWrapper'
import { initApp } from '@/handlers'
import { logout } from '@/utils/localStorage'
import LogoutScreen from '@/components/LogoutScreen'

const UserLayout = () => {
  const { actions: ua } = useContext(UserContext)
  const perfil = ua.persona()
  const nav = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    initApp(ua)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    setIsLoggingOut(true)
    logout()
  }

  return (
    <>
      <nav className="bg-[#FFFFFF9E] shadow-md h-[90px] flex items-center">
        <div className="container flex justify-between flex-wrap gap-1">
          <img
            alt="Logo Neuquén Capital"
            role="button"
            className="h-16"
            src="https://webservice.muninqn.gov.ar/cglobales/assets/banners/neuquen-2024.svg"
            onClick={() => nav('/')}
          />

          {perfil && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-start">
                <small className="nombre-usuario-navbar">{perfil.nombre}</small>
                <br />
                <small className="email-usuario-navbar">
                  {perfil.correoElectronico}
                </small>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-400"></div>

              {/* Botón de logout */}
              <div
                className="ms-2 sm:ms-0 text-primary font-semibold cursor-pointer flex gap-2 items-center text-blue-600 hover:text-blue-800"
                onClick={handleLogout}
                role="button"
              >
                <Logout className="size-5" />
                Salir
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto py-6">
        <Outlet />
      </main>

      {/* Para mostrar pantalla de cierre de sesión */}
      {isLoggingOut && <LogoutScreen />}
    </>
  )
}

export default UserLayout
