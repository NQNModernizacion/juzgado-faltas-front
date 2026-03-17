// import { log } from "@/utils/logger";
// import { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";

// import { useMe } from "@/query/hooks/useMe";
// import { useSessionStore } from "@/store/sessionStore";
// import { WEBLOGIN_URL } from "@/config";

// import Logout from "@/components/Svgs/Logout";
// import LogoutScreen from "@/components/LogoutScreen";

// const UserLayout = () => {
//   // const nav = useNavigate();
//   // const [isLoggingOut, setIsLoggingOut] = useState(false);

//   // const user = useSessionStore((s) => s.user);
//   // const clearAppSession = useSessionStore((s) => s.clearAppSession);

//   // const perfil = user?.persona;
//   // const { data: me, error: meError } = useMe();

//   // useEffect(() => {
//   //   if (me) {
//   //     log.info("[ReactQuery] /me OK", me);
//   //   }
//   //   if (meError) {
//   //     log.error("[ReactQuery] /me ERROR", meError);
//   //   }
//   // }, [me, meError]);

//   // const handleLogout = () => {
//   //   log.info("[UserLayout] logout click");
//   //   setIsLoggingOut(true);

//   //   clearAppSession();
//   //   window.location.href = WEBLOGIN_URL;
//   // };
// const nav = useNavigate();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const user = useSessionStore((s) => s.user);
//   const clearAppSession = useSessionStore((s) => s.clearAppSession);

//   const perfil = user?.persona;
//   const { data: me, error: meError } = useMe();

//   useEffect(() => {
//     if (me) log.info("[ReactQuery] /me OK", me);
//     if (meError) log.error("[ReactQuery] /me ERROR", meError);
//   }, [me, meError]);

//   const handleLogout = () => {
//     log.info("[UserLayout] Cerrando sesión de la app...");
//     setIsLoggingOut(true);

//     // 1. Limpia Zustand y el sessionStorage de la app (según el nuevo store)
//     clearAppSession(); 
    
//     // 2. Redirige. Al no haber borrado la key del LocalStorage (GLOBAL_KEY),
//     // MuniExpress detectará que la sesión sigue activa allí.
//     setTimeout(() => {
//       window.location.href = WEBLOGIN_URL;
//     }, 800); // Pequeño delay para que se vea el LogoutScreen
//   };
//   return (
//     <>
//       <nav className="bg-surface/90 backdrop-blur shadow-mxSoft h-[90px] flex items-center border-b border-border">
//         <div className="container flex justify-between flex-wrap gap-1">
//           <img
//             alt="Logo Neuquén Capital"
//             role="button"
//             className="h-16"
//             src="https://webservice.muninqn.gov.ar/cglobales/assets/logo_rojo.svg"
//             onClick={() => nav("/")}
//           />

//           {perfil && (
//             <div className="flex items-center gap-3">
//               <div className="hidden sm:block text-start leading-tight">
//                 <small className="block text-sm font-semibold text-primary-700">
//                   {perfil.apellidos}, {perfil.nombres}
//                 </small>
//                 <small className="block text-sm font-semibold text-primary-400">
//                   {perfil.correoElectronico}
//                 </small>
//               </div>

//               <div className="hidden sm:block h-12 w-px bg-border" />

//               <div
//                 className="ms-2 sm:ms-0 font-semibold cursor-pointer flex gap-2 items-center text-primary-400 hover:text-primary-700 transition-colors"
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

//       <main className="app-scope container mx-auto py-6">
//         <Outlet />
//       </main>

//       {isLoggingOut && <LogoutScreen />}
//     </>
//   );
// };

// export default UserLayout;

import { log } from "@/utils/logger";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useMe } from "@/query/hooks/useMe";
import { useSessionStore } from "@/store/sessionStore";
import { WEBLOGIN_URL } from "@/config";

import Logout from "@/components/Svgs/Logout";
import LogoutScreen from "@/components/LogoutScreen";
import { LogoNeuquen } from "@/components/Svgs/LogoNeuquen";

const UserLayout = () => {
  const nav = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useSessionStore((s) => s.user);
  const clearAppSession = useSessionStore((s) => s.clearAppSession);

  const perfil = user?.persona;
  const { data: me, error: meError } = useMe();

  useEffect(() => {
    if (me) log.info("[ReactQuery] /me OK", me);
    if (meError) log.error("[ReactQuery] /me ERROR", meError);
  }, [me, meError]);

  const handleLogout = () => {
    log.info("[UserLayout] Cerrando sesión de la app...");
    setIsLoggingOut(true);

    clearAppSession();

    setTimeout(() => {
      window.location.href = WEBLOGIN_URL;
    }, 800);
  };

  return (
    <>
      <nav className="bg-surface/90 backdrop-blur shadow-mxSoft h-[90px] flex items-center border-b border-border">
        <div className="container flex justify-between flex-wrap gap-1">
        <LogoNeuquen
  className="h-16 w-auto text-primary-500 cursor-pointer"
  onClick={() => nav("/")}
/>

          {perfil && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-start leading-tight">
                <small className="block text-sm font-semibold mx-muted uppercase tracking-wider">
                  {perfil.apellidos}, {perfil.nombres}
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