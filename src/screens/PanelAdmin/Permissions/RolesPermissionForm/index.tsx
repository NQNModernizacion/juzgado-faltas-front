import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonBase, SelectSearch } from "muni-ui";
import { UserContext } from "@/context/UserWrapper";
import { useSyncRolePermissions } from "@/query/mutations/useAdminMutations";


type RSOption = { label: string; value: string | number };

const RolesPermissionForm = ({ stateContext, dataContext, show }: any) => {
  if (!show) return null;

  const { actions: ua } = useContext(UserContext);
  const tokenKey = ua.token() ?? null;

  const { state, setState } = stateContext;
  const { role } = state;

  const { data } = dataContext;
  const roles = data?.roles ?? [];
  const permissions = data?.permissions ?? [];

  const syncRolePerms = useSyncRolePermissions(tokenKey);
  const loading = syncRolePerms.isPending;

  const roleOptions: RSOption[] = useMemo(
    () => roles.map((r: any) => ({ label: r.description ?? r.name, value: r.id })),
    [roles]
  );

  const permOptions: RSOption[] = useMemo(
    () => permissions.map((p: any) => ({ label: p.description ?? p.name, value: p.id })),
    [permissions]
  );

  const nameToId = useMemo(() => {
    const m = new Map<string, number>();
    permissions.forEach((p: any) => m.set(p.name, p.id));
    return m;
  }, [permissions]);

  const [permsSelected, setPermsSelected] = useState<RSOption[]>([]);

  // Precarga
  useEffect(() => {
    if (!role?.id) {
      setPermsSelected([]);
      return;
    }

    if (Array.isArray(role.permission_ids)) {
      const selected = permOptions.filter((o) =>
        role.permission_ids.includes(Number(o.value))
      );
      setPermsSelected(selected);
      return;
    }

    if (Array.isArray(role.permission_names)) {
      const ids = role.permission_names
        .map((n: string) => nameToId.get(n))
        .filter((v: any): v is number => typeof v === "number");

      const selected = permOptions.filter((o) =>
        ids.includes(Number(o.value))
      );
      setPermsSelected(selected);
      return;
    }

    setPermsSelected([]);
  }, [role?.id, permOptions, nameToId]);

  const canSave = !!role?.id && !loading;

  const onPickRole = (opt: any) => {
    const picked = roles.find((r: any) => r.id === opt?.value) ?? null;
    setState((s: any) => ({ ...s, role: picked }));
  };

  const onSave = async () => {
    if (!role?.id) return;

    const permissionIds = permsSelected
      .map((p) => Number(p.value))
      .filter((n) => Number.isFinite(n) && n > 0);

    await syncRolePerms.mutateAsync({
      roleId: role.id,
      permissionIds,
    });

    // Reflejar en estado local
    const permission_names = permissionIds
      .map((id) => permissions.find((x: any) => Number(x.id) === id)?.name ?? null)
      .filter(Boolean);

    setState((s: any) => ({
      ...s,
      role: s.role
        ? {
            ...s.role,
            permission_ids: permissionIds,
            permission_names,
          }
        : s.role,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <SelectSearch<RSOption>
            id="role"
            label="Seleccione un Rol *"
            options={roleOptions}
            value={role ? { label: role.description ?? role.name, value: role.id } : null}
            onChange={onPickRole}
            isClearable
            isSearchable
            disabled={loading}
          />
        </div>

        <div className="lg:col-span-5">
          <SelectSearch<RSOption>
            id="permissions"
            label="Permisos del Rol *"
            options={permOptions}
            value={permsSelected}
            onChange={(opts: any) => setPermsSelected(opts ?? [])}
            isMulti
            isClearable
            isSearchable
            disabled={loading || !role?.id}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col">
          {loading && (
            <div className="flex justify-center py-2">
              <span className="mx-spinner" aria-hidden="true" />
            </div>
          )}

          <ButtonBase
            type="button"
            color="primary"
            className="w-full h-10"
            disabled={!canSave}
            onClick={onSave}
          >
            GUARDAR
          </ButtonBase>
        </div>
      </div>

      {permsSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {permsSelected.map((p) => (
            <span
              key={String(p.value)}
              className="rounded-full border px-4 py-1 text-sm font-semibold bg-surface border-border text-text"
            >
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RolesPermissionForm;