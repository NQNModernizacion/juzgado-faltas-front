// import React, { useEffect, useMemo, useState } from "react";
// import { ButtonBase, SelectSearch } from "muni-ui";

// import AddUsers from "../AddUsers";

// import { changeUserRole, getPermissionsForm } from "./handlers";

// interface Role {
//   id: number;
//   description: string;
// }

// interface User {
//   id: number;
//   roles: Role[];
// }

// interface State {
//   loading: boolean;
//   role: Role | null;
//   user: User | null;
// }

// interface DataContext {
//   users: User[] | null | undefined;
//   roles: Role[] | null | undefined;
//   permissions: any[] | null | undefined;
// }

// interface Props {
//   stateContext: {
//     state: State;
//     setState: React.Dispatch<React.SetStateAction<State>>;
//   };
//   dataContext: {
//     data: DataContext;
//     setData: React.Dispatch<React.SetStateAction<DataContext>>;
//   };
//   show: boolean;
// }

// type RSOption = { label: string; value: string | number };

// const UserRoleForm: React.FC<Props> = ({ stateContext, dataContext, show }) => {
//   const { state, setState } = stateContext;
//   const { loading, role, user } = state;

//   const { data, setData } = dataContext;
//   const users = data?.users ?? [];
//   const roles = data?.roles ?? [];
//   const permissions = data?.permissions ?? [];

//   const [showBuscar, setShowBuscar] = useState(false);

//   // (si seguís usando permisosForm en otro lado, ok; si no, podés borrar todo esto)
//   useEffect(() => {
//     getPermissionsForm(permissions, role);
//   }, [permissions, role]);

//   const userOptions: RSOption[] = useMemo(() => {
//     // si hay demasiados, no armar options
//     if (users.length > 2000) return [];
//     return users.map((u) => ({ label: String(u.id), value: u.id }));
//   }, [users]);

//   const roleOptions: RSOption[] = useMemo(
//     () => roles.map((r) => ({ label: r.description, value: r.id })),
//     [roles]
//   );

//   const handleUserSelect = (selectedUser: User) => {
//     setState((prev) => ({ ...prev, user: selectedUser }));
//     setShowBuscar(false);
//   };

//   const canSubmit = !!user && !!role && !loading;
//   const userHasRole = !!user?.roles?.some((r) => r.id === role?.id);

//   if (!show) return null;

//   return (
//     <div className="space-y-4">
//       {/* Buscar por DNI (coral) */}
//       <div className="flex flex-wrap items-center gap-3">
//         <ButtonBase type="button" color="primary" onClick={() => setShowBuscar(true)}>
//           Buscar persona por DNI
//         </ButtonBase>

//         <div className="flex-1 min-w-[320px]">
//           <AddUsers show={showBuscar} onUserSelect={handleUserSelect} />
//         </div>
//       </div>

//       <hr className="border-border" />

//       {/* Selects + acción (alineado) */}
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
//         {/* Usuario */}
//         <div className="lg:col-span-5">
//           <SelectSearch<RSOption>
//             id="user"
//             label="Seleccione un Usuario *"
//             options={userOptions}
//             value={user ? { label: String(user.id), value: user.id } : null}
//             onChange={(opt: any) => {
//               const picked = users.find((u) => u.id === opt?.value) ?? null;
//               setState((prev) => ({ ...prev, user: picked }));
//             }}
//             isClearable
//             isSearchable
//             disabled={loading}
//           />
//         </div>

//         {/* Rol */}
//         <div className="lg:col-span-5">
//           <SelectSearch<RSOption>
//             id="role"
//             label="Seleccione un Rol *"
//             options={roleOptions}
//             value={role ? { label: role.description, value: role.id } : null}
//             onChange={(opt: any) => {
//               const picked = roles.find((r) => r.id === opt?.value) ?? null;
//               setState((prev) => ({ ...prev, role: picked }));
//             }}
//             isClearable
//             isSearchable
//             disabled={loading}
//           />
//         </div>

//         {/* Botón (amarillo) */}
//         <div className="lg:col-span-2 flex flex-col">
//           {loading ? (
//             <div className="flex justify-center py-2">
//               <span className="mx-spinner" aria-hidden="true" />
//             </div>
//           ) : null}

//           {!userHasRole ? (
//             <ButtonBase
//               type="button"
//               color="secondary"          // <- AMARILLO
//               variant="solid"
//               className="self-end w-full h-10" // <- ALINEA ABAJO Y MISMA ALTURA
//               disabled={!canSubmit}
//               onClick={() =>
//                 changeUserRole(user!, role!, setState, setData, "add_user_role")
//               }
//             >
//               AGREGAR
//             </ButtonBase>
//           ) : (
//             <ButtonBase
//               type="button"
//               // opción A: mantener RETIRAR en coral (primary)
//               color="primary"
//               // opción B: si querés danger, cambiá a "danger"
//               variant="solid"
//               className="self-end w-full h-10"
//               disabled={!canSubmit}
//               onClick={() =>
//                 changeUserRole(user!, role!, setState, setData, "remove_user_role")
//               }
//             >
//               RETIRAR
//             </ButtonBase>
//           )}
//         </div>
//       </div>

//       {/* Chips de roles del usuario (si los querés mantener, quedan) */}
//       {!!user?.roles?.length ? (
//         <div className="flex flex-wrap gap-2">
//           {user.roles.map((r) => {
//             const active = r.id === role?.id;
//             return (
//               <button
//                 key={r.id}
//                 type="button"
//                 disabled={loading}
//                 onClick={() => !loading && setState((p) => ({ ...p, role: r }))}
//                 className={[
//                   "rounded-full border px-4 py-1 text-sm font-semibold transition",
//                   active
//                     ? "bg-secondary-200 border-secondary-300 text-primary-800"
//                     : "bg-surface border-border text-text hover:bg-bg",
//                   loading ? "opacity-60 cursor-not-allowed" : "",
//                 ].join(" ")}
//               >
//                 {r.description}
//               </button>
//             );
//           })}
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default UserRoleForm;
import React, { useEffect, useMemo, useState } from "react";
import { ButtonBase, SelectSearch } from "muni-ui";

import AddUsers from "../AddUsers";

// 👇 IMPORTANTE: cambiá el import al nuevo handler MULTI
// en handlers.ts debería existir: changeUserRoles(user, rolesSelected, setState, setData)
import { addUserRoles, changeUserRoles } from "./handlers";

interface Role {
  id: number;
  description: string;
  // opcional si lo tenés en bootstrap:
  name?: string;
}

interface User {
  id: number;
  roles: Role[]; // en tu UI lo usás para chips, puede venir vacío
}

interface State {
  loading: boolean;
  user: User | null;
}

interface DataContext {
  users: User[] | null | undefined; // (idealmente esto lo vas a eliminar)
  roles: Role[] | null | undefined;
  permissions: any[] | null | undefined;
}

interface Props {
  stateContext: {
    isMulti?: boolean; // para saber si el select de roles es multi o no
    state: State;
    setState: React.Dispatch<React.SetStateAction<any>>;
  };
  dataContext: {
    data: DataContext;
    setData: React.Dispatch<React.SetStateAction<any>>;
  };
  show: boolean;
}

type RSOption = { label: string; value: string | number };

const UserRoleForm: React.FC<Props> = ({ stateContext, dataContext, show }) => {
  const { state, setState } = stateContext;
  const { loading, user } = state;

  const { data, setData } = dataContext;
  const users = data?.users ?? [];
  const roles = data?.roles ?? [];

  const [showBuscar, setShowBuscar] = useState(false);

  // ✅ MULTI: roles seleccionados por ID
  const [rolesSelected, setRolesSelected] = useState<RSOption[]>([]);
  

  // si hay demasiados, no armar options (esto igual lo vas a sacar)
  const userOptions: RSOption[] = useMemo(() => {
    if (users.length > 2000) return [];
    return users.map((u) => ({ label: String(u.id), value: u.id }));
  }, [users]);

  const roleOptions: RSOption[] = useMemo(
    () => roles.map((r) => ({ label: r.description, value: r.id })),
    [roles]
  );

  // cuando cambia el user, opcionalmente resetea roles seleccionados
 useEffect(() => {
  const existing = (
    user?.role_names ??
    user?.roles?.map((r: any) => r.name ?? r.description) ??
    []
  ) as string[];

  const pre = existing
    .map((name) => roleOptions.find((o) => o.label === name))
    .filter(Boolean) as RSOption[];

  setRolesSelected((prev) => {
    const prevValues = prev.map((x) => String(x.value)).join("|");
    const nextValues = pre.map((x) => String(x.value)).join("|");

    return prevValues === nextValues ? prev : pre;
  });
}, [user?.id]);

  
  const handleUserSelect = (selectedUser: User) => {
    setState((prev: any) => ({ ...prev, user: selectedUser }));
    setShowBuscar(false);
  };

  const canSubmit = !!user && rolesSelected.length > 0 && !loading;

  if (!show) return null;

  return (
    <div className="space-y-4">
      {/* Buscar por DNI */}
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
        {/* Usuario (opcional: lo vas a eliminar cuando uses sólo búsqueda por DNI) */}
        <div className="lg:col-span-5">
          <SelectSearch<RSOption>
            id="user"
            label="Seleccione un Usuario *"
            options={userOptions}
            value={user ? { label: String(user.id), value: user.id } : null}
            onChange={(opt: any) => {
              const picked = users.find((u) => u.id === opt?.value) ?? null;
              setState((prev: any) => ({ ...prev, user: picked }));
            }}
            isClearable
            isSearchable
            disabled={loading}
          />
        </div>

        {/* Roles MULTI */}
        <div className="lg:col-span-5">
          <SelectSearch<RSOption>
            id="roles"
            label="Seleccione Roles *"
            options={roleOptions}
            value={rolesSelected}
            onChange={(opts: any) => setRolesSelected(opts ?? [])}
            isMulti={true}
            isClearable
            isSearchable
            disabled={loading}
          />
        </div>

        {/* Botón */}
        <div className="lg:col-span-2 flex flex-col">
          {loading ? (
            <div className="flex justify-center py-2">
              <span className="mx-spinner" aria-hidden="true" />
            </div>
          ) : null}

<ButtonBase
  type="button"
  color="secondary"
  disabled={!user || rolesSelected.length === 0 || loading}
  onClick={() => addUserRoles(user, rolesSelected, setState)}
>
  AGREGAR
</ButtonBase>
        </div>
      </div>

      {/* Chips informativos (si querés mostrar lo que YA tiene el usuario) */}
      {!!user?.roles?.length ? (
        <div className="flex flex-wrap gap-2">
          {user.roles.map((r) => (
            <span
              key={r.id}
              className="rounded-full border px-4 py-1 text-sm font-semibold bg-surface border-border text-text"
            >
              {r.description}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default UserRoleForm;