import { log } from "@/utils/logger";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSessionStore } from "@/store/sessionStore";
import { setStorage } from "@/utils/localStorage";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { schema } from "@/schemas/LoginSchema";
import { useLoginMutation } from "@/query/mutations/useAuthMutations";

import { ButtonBase, RHFInput } from "muni-ui";

type LoginFormData = {
  _id: string;
  password: string;
};

const LoginForm = () => {
  const nav = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const setSession = useSessionStore((s) => s.setSession);

  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: { _id: "", password: "" },
  });

  const login = async (form: LoginFormData) => {
    log.info("[LoginForm] login submit");
    setLoginError(null);

    try {
      const data = await loginMutation.mutateAsync({
        ...form,
        type: "internal",
      });

      setSession({
        token: data.token,
        tokenType: data.token_type,
        expiresAt: data.expires_at,
        user: data.user,
      });

      setStorage({
        user: data.user ?? null,
        app_data: null,
        front_types: [],
        token: data.user?.token_weblogin ?? data.token ?? null,
      });

      nav("/");
    } catch (err: any) {
      log.error("[LoginForm] login error", err);

      const msg =
        err?.general ??
        err?.message ??
        err?.response?.data?.error?.general ??
        err?.response?.data?.error ??
        "Ocurrió un error inesperado al ingresar al sistema";

      if (msg === "Credenciales incorrectas") {
        setLoginError(msg);
        return;
      }

      toast.error("Ocurrió un error inesperado al ingresar al sistema");
    }
  };

  const invalid = (errors: unknown) => {
    log.info("[LoginForm] invalid", errors);
  };

  return (
    <form onSubmit={handleSubmit(login, invalid)} className="space-y-4">
      <h2 className="text-center text-2xl mx-muted font-bold ">
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
        isLoading={isSubmitting || loginMutation.isPending}
      >
        ACCEDER
      </ButtonBase>
    </form>
  );
};

export default LoginForm;