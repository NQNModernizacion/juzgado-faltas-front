import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonBase, SelectSearch } from "@nqnmodernizacion/muni-ui";
import AddUsers from "../AddUsers";
import Loader from "@/components/Loader";

import { UserContext } from "@/context/UserWrapper";

import { useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { toastOptions } from "@/config/toast";
import { useSyncUserPermissions } from "@/query/mutations/useAdminMutations";
import { useSessionStore } from "@/store/sessionStore";

interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface User {
  id: number;
  permissions?: any[];
  permission_names?: string[];
}

type RSOption = { label: string; value: string | number };

const UserPermissionForm = ({ stateContext, dataContext, show }: any) => {
  const { state, setState } = stateContext;
  const { user } = state;

  const { data } = dataContext;
  const permissions: Permission[] = data?.permissions ?? [];

  const token = useSessionStore((s) => s.token);
const tokenKey = token ?? null;

  const qc = useQueryClient();
  const syncPerms = useSyncUserPermissions(tokenKey);

  const [showBuscar, setShowBuscar] = useState(false);
  const [permsSelected, setPermsSelected] = useState<RSOption[]>([]);

  const permOptions: RSOption[] = useMemo(
    () =>
      permissions.map((p) => ({
        label: p.description ?? p.name,
        value: p.id,
      })),
    [permissions]
  );

  const permNameToId = useMemo(() => {
    const m = new Map<string, number>();
    permissions.forEach((p) => m.set(p.name, p.id));
    return m;
  }, [permissions]);

  useEffect(() => {
    if (!user) {
      setPermsSelected((prev) => (prev.length ? [] : prev));
      return;
    }

    let names: string[] = Array.isArray(user.permission_names) ? user.permission_names : [];

    if (!names.length && Array.isArray(user.permissions)) {
      const p0 = user.permissions[0];
      if (typeof p0 === "string") {
        names = user.permissions as string[];
      } else if (p0 && typeof p0 === "object") {
        names = (user.permissions as any[]).map((x) => x?.name).filter(Boolean);
      }
    }

    const ids = names
      .map((n) => permNameToId.get(n))
      .filter((v): v is number => typeof v === "number");

    const nextSelected = permOptions.filter((o) => ids.includes(Number(o.value)));

    setPermsSelected((prev) => {
      const prevValues = prev.map((x) => String(x.value)).join("|");
      const nextValues = nextSelected.map((x) => String(x.value)).join("|");

      return prevValues === nextValues ? prev : nextSelected;
    });
  }, [user?.id]);

  const handleUserSelect = (selectedUser: any) => {
    setState((prev: any) => ({ ...prev, user: selectedUser }));
    setShowBuscar(false);
  };

  const canSave = !!user && permsSelected.length > 0 && !syncPerms.isPending;

  if (!show) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonBase type="button" onClick={() => setShowBuscar(true)}>
          Buscar persona por DNI
        </ButtonBase>

        <AddUsers show={showBuscar} onUserSelect={handleUserSelect} />
      </div>

      <hr className="border-border" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-10">
          <SelectSearch<RSOption>
            id="permissions"
            label="Seleccione Permisos *"
            options={permOptions}
            value={permsSelected}
            onChange={(opts: any) => setPermsSelected(opts ?? [])}
            isMulti
            isClearable
            isSearchable
            disabled={!user || syncPerms.isPending}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-2">
          {syncPerms.isPending ? (
            <div className="flex justify-center py-2">
              <Loader />
            </div>
          ) : null}

          <ButtonBase
            type="button"
            color="primary"
            disabled={!canSave}
            onClick={() => {
              const permissionIds = permsSelected
                .map((p) => Number(p.value))
                .filter((n) => Number.isFinite(n) && n > 0);

              syncPerms.mutate(
                { userId: user!.id, permissionIds },
                {
                  onSuccess: () => {
                    toast.success("Permisos guardados", toastOptions);
                  },
                  onError: (e: any) => {
                    const msg = e?.message ?? e?.error ?? "Error guardando permisos";
                    toast.error(msg, toastOptions);
                  },
                }
              );
            }}
          >
            GUARDAR
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionForm;