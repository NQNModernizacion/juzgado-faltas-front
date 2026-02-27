import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ButtonBase, Container } from "muni-ui";

import { initialDataState, initialState, screen_dic } from "./handlers";
import UserRoleForm from "./UserRoleForm";
import UserPermissionForm from "./UserPermissionForm";
import RolesPermissionForm from "./RolesPermissionForm";

import { UserContext } from "@/context/UserWrapper";
import { useAdminBootstrap } from "@/query/hooks/useAdminBootstrap";

interface State {
  screen: keyof typeof screen_dic;
  loading: boolean;
  role: any | null;
  user: any | null;
}

interface Data {
  users: any[];
  roles: any[];
  permissions: any[];
}

const Permissions: React.FC = () => {
  const [state, setState] = useState<State>({ ...initialState });
  const [data, setData] = useState<Data>({ ...initialDataState });

  // ✅ acá estaba tu problema: ua no existía
  const { actions: ua } = useContext(UserContext);

  const token = ua.token();
  const tokenKey = token ?? null;

  const bootstrap = useAdminBootstrap({
    enabled: Boolean(token),
    tokenKey,
  });

  // ✅ volcar bootstrap al dataContext
  useEffect(() => {
    if (!bootstrap.data) return;

    setData((prev) => ({
      ...prev,
      roles: bootstrap.data.roles ?? [],
      permissions: bootstrap.data.permissions ?? [],
    }));
  }, [bootstrap.data]);

  // ✅ mantener state.loading con isFetching
  useEffect(() => {
    setState((prev) => ({ ...prev, loading: bootstrap.isFetching }));
  }, [bootstrap.isFetching]);

  const handleScreenChange = useCallback((key: keyof typeof screen_dic) => {
    setState((prev) => ({
      ...prev,
      screen: key,
      role: null,
      user: null,
    }));
  }, []);

  const navigationButtons = useMemo(() => {
    return (Object.keys(screen_dic) as Array<keyof typeof screen_dic>).map((key) => {
      const isActive = key === state.screen;
      const isDisabled = state.loading || isActive;

      const variant = isActive ? "solid" : "outline";
      const color = "secondary";

      return (
        <ButtonBase
          key={String(key)}
          type="button"
          size="sm"
          variant={variant}
          color={color}
          disabled={isDisabled}
          onClick={() => handleScreenChange(key)}
          className={[
            "rounded-full px-6 py-2 text-sm font-semibold",
            "text-primary-700",
            !isActive ? "bg-secondary-100 border-secondary-200 hover:bg-secondary-200" : "",
            isDisabled ? "cursor-not-allowed opacity-90" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {screen_dic[key]}
        </ButtonBase>
      );
    });
  }, [state.screen, state.loading, handleScreenChange]);

  return (
    <Container
      title="Panel Admin"
      subtitle={`Configuración de roles y permisos - ${screen_dic[state.screen]}`}
      linkBack="#/"
    >
      <div className="flex flex-wrap justify-center gap-3">{navigationButtons}</div>

      <hr className="my-4 border-border" />

      <UserRoleForm
        stateContext={{ state, setState }}
        dataContext={{ data, setData }}
        show={state.screen === "user_roles"}
      />

      <UserPermissionForm
        stateContext={{ state, setState }}
        dataContext={{ data, setData }}
        show={state.screen === "user_permissions"}
      />

      <RolesPermissionForm
        stateContext={{ state, setState }}
        dataContext={{ data, setData }}
        show={state.screen === "roles_permissions"}
      />
    </Container>
  );
};

export default Permissions;