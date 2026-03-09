// import { log } from "@/utils/logger";
// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";

// import { axios } from "@/utils/axios";
// import { UserContext } from "@/context/UserWrapper";
// import { schema } from "@/schemas/LoginSchema";
// import { setStorage } from "@/utils/localStorage";


// import { ButtonBase, RHFInput } from "muni-ui";

// const LoginForm = () => {
//   const { actions: ua } = useContext(UserContext);
//   const nav = useNavigate();
//   const [loginError, setLoginError] = useState<string | null>(null);


//   const {
//     control,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: { _id: "", password: "" },
//   });

//   const login = async (form: any) => {
//     log.info("[UserLayout] logout click");
//     setLoginError(null);

//     try {
//       const payload = { ...form, type: "internal" };
//       const response = await axios().post("auth", payload);
//       const { data, error } = response.data ?? {};

//       if (data) {
//         setStorage(data);
//         ua.setStore(data);
//         nav("/");
//         return;
//       }

//       if (error) {
//         if (error.general === "Credenciales incorrectas") {
//           setLoginError(error.general);
//         } else {
//           toast.error("Ocurrió un error inesperado al ingresar al sistema");
//         }
//       }
//     } catch {
//       toast.error("Ocurrió un error inesperado al ingresar al sistema");
//     }
//   };

//   const invalid = (errors: any) => {
//     // para que “no haga nada” nunca más sin feedback
//     console.log("Login invalid", errors);
//   };

//   return (
//     <form onSubmit={handleSubmit(login, invalid)} className="space-y-4">
//       <h2 className="text-center text-2xl font-bold text-text">
//         Ingresar al sistema
//       </h2>

//       <hr className="border-border" />

//       <RHFInput
//         control={control}
//         name="_id"
//         label="Correo electrónico / DNI *"
//         placeholder="usuario@gmail.com / 99.999.999"
//       />

//       <RHFInput
//         control={control}
//         name="password"
//         type="password"
//         label="Contraseña *"
//         placeholder="********"
//       />

//       {loginError ? (
//         <div className="mx-error">{loginError}</div>
//       ) : null}

//       <ButtonBase
//         className="w-full"
//         type="submit"
//         color="primary"
//         isLoading={isSubmitting}
//       >
//         ACCEDER
//       </ButtonBase>
//     </form>
//   );
// };

// export default LoginForm;
import { log } from "@/utils/logger";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { axios } from "@/utils/axios";
import { UserContext } from "@/context/UserWrapper";
import { schema } from "@/schemas/LoginSchema";
import { useSessionStore } from "@/store/sessionStore";

import { ButtonBase, RHFInput } from "muni-ui";

const LoginForm = () => {
  const { actions: ua } = useContext(UserContext);
  const nav = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const setSession = useSessionStore((s) => s.setSession);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { _id: "", password: "" },
  });

  const login = async (form: any) => {
    log.info("[LoginForm] login submit");
    setLoginError(null);

    try {
      const payload = { ...form, type: "internal" };
      const response = await axios().post("auth", payload);
      const { data, error } = response.data ?? {};

      if (data) {
        setSession({
          token: data.token,
          tokenType: data.token_type,
          expiresAt: data.expires_at,
          user: data.user,
        });

        ua.setStore?.(data); // temporal, mientras migrás el contexto viejo
        nav("/");
        return;
      }

      if (error) {
        if (error.general === "Credenciales incorrectas") {
          setLoginError(error.general);
        } else {
          toast.error("Ocurrió un error inesperado al ingresar al sistema");
        }
      }
    } catch (err) {
      log.error("[LoginForm] login error", err);
      toast.error("Ocurrió un error inesperado al ingresar al sistema");
    }
  };

  const invalid = (errors: any) => {
    console.log("Login invalid", errors);
  };

  return (
    <form onSubmit={handleSubmit(login, invalid)} className="space-y-4">
      <h2 className="text-center text-2xl font-bold text-text">
        Ingresar al sistema
      </h2>

      <hr className="border-border" />

      <RHFInput
        control={control}
        name="_id"
        label="Correo electrónico / DNI *"
        placeholder="usuario@gmail.com / 99.999.999"
      />

      <RHFInput
        control={control}
        name="password"
        type="password"
        label="Contraseña *"
        placeholder="********"
      />

      {loginError ? <div className="mx-error">{loginError}</div> : null}

      <ButtonBase
        className="w-full"
        type="submit"
        color="primary"
        isLoading={isSubmitting}
      >
        ACCEDER
      </ButtonBase>
    </form>
  );
};

export default LoginForm;