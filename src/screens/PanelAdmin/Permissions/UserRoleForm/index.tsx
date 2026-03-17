import React, { useEffect, useMemo, useState } from "react";
import { ButtonBase, SelectSearch } from "muni-ui";
import { toast } from "react-toastify";

import AddUsers from "../AddUsers";
import { toastOptions } from "@/config/toast";
import { useSyncUserRoles } from "@/query/mutations/useAdminMutations";
import { useSessionStore } from "@/store/sessionStore";

interface Role {
  id: number;
  description: string;
  name?: string;
}

interface Permission {
  id: number;
  name: string;
}

interface User {
  id: number;
  email?: string;
  role_names?: string[];
  permission_names?: string[];
  roles: Role[];
  permissions?: Permission[];
}

interface State {
  loading: boolean;
  user: User | null;
}

interface DataContext {
  users: User[] | null | undefined;
  roles: Role[] | null | undefined;
  permissions: any[] | null | undefined;
}

interface Props {
  stateContext: {
    isMulti?: boolean;
    state: State;
    setState: React.Dispatch<React.SetStateAction<any>>;
  };
  dataContext: {
    data: DataContext;
    setData: React.Dispatch<React.SetStateAction<any>>;
  };
  show: boolean;
}

type RSOption = {
  label: string;
  value: string | number;
};

const UserRoleForm: React.FC<Props> = ({ stateContext, dataContext, show }) => {
  const { state, setState } = stateContext;
  const { user } = state;

  const { data } = dataContext;
  const users = data?.users ?? [];
  const roles = data?.roles ?? [];

  const tokenKey = useSessionStore((s) => s.token) ?? null;
  const syncRoles = useSyncUserRoles(tokenKey);

  const [showBuscar, setShowBuscar] = useState(false);
  const [rolesSelected, setRolesSelected] = useState<RSOption[]>([]);

  const userOptions: RSOption[] = useMemo(() => {
    if (users.length > 2000) return [];

    return users.map((u) => ({
      label: String(u.id),
      value: u.id,
    }));
  }, [users]);

  const roleOptions: RSOption[] = useMemo(() => {
    return roles.map((r) => ({
      label: r.description,
      value: r.id,
    }));
  }, [roles]);

  useEffect(() => {
    const existing =
      user?.role_names ??
      user?.roles?.map((r: any) => r.name ?? r.description) ??
      [];

    const pre = existing
      .map((name: string) => roleOptions.find((o) => o.label === name))
      .filter(Boolean) as RSOption[];

    setRolesSelected((prev) => {
      const prevValues = prev.map((x) => String(x.value)).join("|");
      const nextValues = pre.map((x) => String(x.value)).join("|");

      return prevValues === nextValues ? prev : pre;
    });
  }, [user?.id, roleOptions]);

  const handleUserSelect = (selectedUser: User) => {
    setState((prev: any) => ({
      ...prev,
      user: selectedUser,
    }));
    setShowBuscar(false);
  };

  const loading = syncRoles.isPending;
  const canSubmit = !!user && rolesSelected.length > 0 && !loading;

  const handleSaveRoles = () => {
    if (!user?.id) {
      toast.error("Seleccioná un usuario válido", toastOptions);
      return;
    }

    const roleNames = rolesSelected
      .map((r) => String(r.label))
      .filter(Boolean);

    if (!roleNames.length) {
      toast.error("Seleccioná al menos un rol", toastOptions);
      return;
    }

    syncRoles.mutate(
      {
        userId: user.id,
        roles: roleNames,
      },
      {
        onSuccess: (resp: any) => {
          const newRoles = resp?.roles ?? roleNames;
          const newPerms = resp?.permissions ?? user?.permission_names ?? [];

          setState((s: any) => ({
            ...s,
            user: {
              ...s.user,
              id: user.id,
              role_names: newRoles,
              permission_names: newPerms,
              roles: newRoles.map((name: string) => ({
                id: -1,
                name,
                description: name,
              })),
              permissions: newPerms.map((name: string) => ({
                id: -1,
                name,
              })),
            },
          }));

          toast.success("Roles guardados", toastOptions);
        },
        onError: (e: any) => {
          const msg =
            e?.response?.data?.error ??
            e?.message ??
            e?.error ??
            "Error guardando roles";

          toast.error(msg, toastOptions);
        },
      }
    );
  };

  if (!show) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonBase
          type="button"
          color="primary"
          onClick={() => setShowBuscar(true)}
        >
          Buscar persona por DNI
        </ButtonBase>

        <div className="flex-1 min-w-[320px]">
          <AddUsers show={showBuscar} onUserSelect={handleUserSelect} />
        </div>
      </div>

      <hr className="border-border" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <SelectSearch
            id="user"
            label="Seleccione un Usuario *"
            options={userOptions}
            value={user ? { label: String(user.id), value: user.id } : null}
            onChange={(opt: any) => {
              const picked = users.find((u) => u.id === opt?.value) ?? null;
              setState((prev: any) => ({
                ...prev,
                user: picked,
              }));
            }}
            isClearable
            isSearchable
            disabled={loading}
          />
        </div>

        <div className="lg:col-span-5">
          <SelectSearch
            id="roles"
            label="Seleccione Roles *"
            options={roleOptions}
            value={rolesSelected}
            onChange={(opts: any) => setRolesSelected(opts ?? [])}
            isMulti={true}
            isClearable
            isSearchable
            disabled={loading || !user}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col">
          {loading ? (
            <div className="flex justify-center py-2">
              <span className="mx-spinner" aria-hidden="true" />
            </div>
          ) : null}

          <ButtonBase
            type="button"
            color="secondary"
            disabled={!canSubmit}
            onClick={handleSaveRoles}
          >
            GUARDAR
          </ButtonBase>
        </div>
      </div>

      {!!user?.roles?.length && (
        <div className="flex flex-wrap gap-2">
          {user.roles.map((r) => (
            <span
              key={`${r.id}-${r.description}`}
              className="rounded-full border px-4 py-1 text-sm font-semibold bg-surface border-border text-text"
            >
              {r.description}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRoleForm;