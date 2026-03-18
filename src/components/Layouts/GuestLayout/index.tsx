import { UserContext } from '@/context/UserWrapper'
import { initApp } from '@/handlers'
import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

type GuestLayoutProps = {
  children?: React.ReactNode
}

const GuestLayout = ({ children }: GuestLayoutProps) => {
  const { actions: ua } = useContext(UserContext)

  useEffect(() => {
    initApp(ua)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* <nav className="bg-[#FFFFFF9E] mb-4 shadow-md h-[90px] flex items-center">
        <div className="container flex justify-between flex-wrap gap-1">
          <img
            alt="Logo Neuquén Capital"
            role="button"
            className="h-16"
            src="https://webservice.muninqn.gov.ar/cglobales/assets/banners/neuquen-2024.svg"
            src='https://webservice.muninqn.gov.ar/cglobales/assets/logo_rojo.svg'
          />
        </div>
      </nav> */}
         <nav className="bg-white mb-4 shadow-md h-[90px] flex items-center">
        <div className="container flex justify-between flex-wrap gap-1">
          <img
            alt="Logo Neuquén Capital"
            role="button"
            className="h-16"
            //src="https://webservice.muninqn.gov.ar/cglobales/assets/banners/neuquen-2024.svg"
            src='https://webservice.muninqn.gov.ar/cglobales/assets/logo_rojo.svg'
          />
        </div>
      </nav>

      <main className="container mx-auto">{children ?? <Outlet />}</main>
    </>
  )
}

export default GuestLayout
