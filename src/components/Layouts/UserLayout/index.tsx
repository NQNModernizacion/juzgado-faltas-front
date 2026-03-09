// import { log } from "@/utils/logger";
// import { useContext, useEffect, useState } from 'react'
// import { Outlet, useNavigate } from 'react-router-dom'

// import { useMe } from "@/query/hooks/useMe";

// import Logout from '@/components/Svgs/Logout'
// import { UserContext } from '@/context/UserWrapper'
// import { initApp } from '@/handlers'
// import { logout } from '@/utils/localStorage'
// import LogoutScreen from '@/components/LogoutScreen'

// const UserLayout = () => {
//   const { actions: ua } = useContext(UserContext)
//   const perfil = ua.persona()
//   const nav = useNavigate()

//   const token = ua.token();
// const { data: me, isLoading: meLoading, error: meError } = useMe(token);

//   const [isLoggingOut, setIsLoggingOut] = useState(false)
 


//   useEffect(() => {
//     if (me) {
//       log.info("[ReactQuery] /me OK", me);
//     }
//     if (meError) {
//       log.error("[ReactQuery] /me ERROR", meError);
//     }
//   }, [me, meError]);
  




//   const handleLogout = () => {
//     log.info("[UserLayout] logout click");
//     log.error("ALWAYS");
//     setIsLoggingOut(true);

//     // 1) borra storage
//     logout();

//     // limpia store en memoria
//     ua.setStore({
//       user: null,
//       app_data: null,
//       front_types: [],
//       token: null,
//     });
//     log.info("[UserLayout] clearing store");
//     // navegá al login 
//     nav("/login", { replace: true });

//     // sacar overlay después de navegar
//     setIsLoggingOut(false);
//   };


//   return (
//     <>
//       <nav className="bg-surface/90 backdrop-blur shadow-mxSoft h-[90px] flex items-center border-b border-border">
//         <div className="container flex justify-between flex-wrap gap-1">
//           <img
//             alt="Logo Neuquén Capital"
//             role="button"
//             className="h-16"
//             src='https://webservice.muninqn.gov.ar/cglobales/assets/logo_rojo.svg'
//             //src="https://webservice.muninqn.gov.ar/cglobales/assets/banners/neuquen-2024.svg"
//             onClick={() => nav('/')}
//           />

//           {perfil && (
//             <div className="flex items-center gap-3">
//               {/* <div className="hidden sm:block text-start">
//                 <small className="nombre-usuario-navbar">{perfil.nombre}</small>
//                 <br />
//                 <small className="email-usuario-navbar">
//                   {perfil.correoElectronico}
//                 </small>
//               </div> */}
//               <div className="hidden sm:block text-start leading-tight">
//                 <small className="block text-sm font-semibold text-primary-600">
//                   {perfil.nombre}
//                 </small>
//                 <small className="block text-sm text-muted">
//                   {perfil.correoElectronico}
//                 </small>
//               </div>


//               <div className="hidden sm:block h-12 w-px bg-border"></div>

//               {/* Botón de logout */}
//               <div
//                 className="ms-2 sm:ms-0
//     font-semibold cursor-pointer
//     flex gap-2 items-center
//     text-primary-600 hover:text-primary-700
//     transition-colors"
//                 onClick={handleLogout}
//                 role="button"
//               >
//                 <Logout className="size-5" />
//                 Salir
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* <main className="container mx-auto py-6">
//         <Outlet />
//       </main> */}
//       <main className="app-scope container mx-auto py-6">
//         <Outlet />
//       </main>

//       {/* Para mostrar pantalla de cierre de sesión */}
//       {isLoggingOut && <LogoutScreen />}
//     </>
//   )
// }

// export default UserLayout


import { log } from "@/utils/logger";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useMe } from "@/query/hooks/useMe";
import { useSessionStore } from "@/store/sessionStore";

import Logout from "@/components/Svgs/Logout";
import LogoutScreen from "@/components/LogoutScreen";

const UserLayout = () => {
  const nav = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useSessionStore((s) => s.user);
  const clearAppSession = useSessionStore((s) => s.clearAppSession);

  const perfil = user?.persona;

  const { data: me, error: meError } = useMe();

  useEffect(() => {
    if (me) {
      log.info("[ReactQuery] /me OK", me);
    }
    if (meError) {
      log.error("[ReactQuery] /me ERROR", meError);
    }
  }, [me, meError]);

  const handleLogout = () => {
    log.info("[UserLayout] logout click");
    setIsLoggingOut(true);

    clearAppSession();
    nav("/login", { replace: true });

    setIsLoggingOut(false);
  };

  return (
    <>
      <nav className="bg-surface/90 backdrop-blur shadow-mxSoft h-[90px] flex items-center border-b border-border">
        <div className="container flex justify-between flex-wrap gap-1">
          <img
            alt="Logo Neuquén Capital"
            role="button"
            className="h-16"
            src="https://webservice.muninqn.gov.ar/cglobales/assets/logo_rojo.svg"
            onClick={() => nav("/")}
          />

          {perfil && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-start leading-tight">
                <small className="block text-sm font-semibold text-primary-700">
                  {perfil.nombres} {perfil.apellidos}
                </small>
                <small className="block text-sm font-semibold text-primary-400">
                  {perfil.correoElectronico}
                </small>
              </div>

              <div className="hidden sm:block h-12 w-px bg-border" />

              <div
                className="ms-2 sm:ms-0 font-semibold cursor-pointer flex gap-2 items-center text-primary-400 hover:text-primary-700 transition-colors"
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

      <main className="app-scope container mx-auto py-6">
        <Outlet />
      </main>

      {isLoggingOut && <LogoutScreen />}
    </>
  );
};

export default UserLayout;