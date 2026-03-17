// import { useContext, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { UserContext } from "../../../context";
// import {
//   buscarRol,
//   getPermisos,
//   getRoles,
//   guardarPermisos,
//   tablePermisosRolModel,
// } from "./handlers";

// import {
//   Container,
//   ButtonBase,
//   SelectSearch,
//   Table,
//   FormSection,
//   InputBase,
// } from "muni-ui";

// export default function RolesPermisos() {
//   const { actions } = useContext(UserContext);
//   const navigate = useNavigate();

//   const [roles, setRoles] = useState({ data: null, error: null, loading: false });

//   const [rol, setRol] = useState({
//     data: null,
//     error: null,
//     loading: false,
//     permisos_rol: [],
//     rol: [],
//   });

//   const [permisos, setPermisos] = useState({ data: null, error: null, loading: false });

//   const [guardar, setGuardar] = useState({ data: null, error: null, loading: false });

//   const [q, setQ] = useState("");

//   useEffect(() => {
//     if (!(actions.hasPermission("admin.role-permission.view") && actions.isAdmin())) {
//       navigate(actions.isAdmin() ? "/administrador/roles-permisos" : "/");
//       return;
//     }
//     getRoles(roles, setRoles);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (rol.data != null) getPermisos(permisos, setPermisos);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [rol.data]);

//   const model = useMemo(() => {
//     if (!permisos.data) return { columns: [], rows: [] };

//     const base = tablePermisosRolModel(permisos.data, actions, rol, setRol);
//     const rows = q.trim() ? base.rows.filter((r) => base.filter(r, q)) : base.rows;

//     return { columns: base.columns, rows };
//   }, [permisos.data, actions, rol, q]);

//   const selectedRole = rol.rol?.[0] ?? null;
//   const canViewRole = (rol.rol?.length ?? 0) > 0 && !rol.loading;
//   const canAssign = actions.hasPermission("admin.role-permission.asign");

//   const canSync =
//     canAssign &&
//     !!rol.data &&
//     (rol.permisos_rol?.length ?? 0) > 0 &&
//     !guardar.loading;

//   return (
//     <Container
//       linkBack="/administrador/roles-permisos"
//       title="Administración de Permisos de Roles"
//       className="space-y-4"
//     >
//       {(roles.loading || rol.loading || permisos.loading) ? (
//         <div className="flex justify-center py-2">
//           <span className="mx-spinner" aria-hidden="true" />
//         </div>
//       ) : null}

//       <FormSection title="Seleccionar rol" fullWidth>
//         {roles.data ? (
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
//             <div className="md:col-span-9">
//               <SelectSearch
//                 id="roles"
//                 label="Listado de Roles"
//                 isMulti
//                 options={roles.data}
//                 placeholder="Seleccione un Rol"
//                 value={rol.rol}
//                 onChange={(e) => {
//                   setRol((prev) => ({ ...prev, rol: e }));
//                   setPermisos((prev) => ({ ...prev, data: null }));
//                 }}
//                 isClearable
//                 isSearchable
//                 disabled={roles.loading || rol.loading}
//               />
//             </div>

//             <div className="md:col-span-3">
//               <ButtonBase
//                 type="button"
//                 color="primary"
//                 className="w-full"
//                 disabled={!canViewRole}
//                 onClick={() => buscarRol(rol, setRol, permisos, setPermisos)}
//               >
//                 Ver permisos del rol
//               </ButtonBase>
//             </div>
//           </div>
//         ) : (
//           <div className="text-sm text-muted">Sin roles</div>
//         )}

//         {selectedRole ? (
//           <div className="mt-2 text-sm text-muted">
//             Rol seleccionado: <span className="font-semibold text-text">{selectedRole.name ?? selectedRole.label}</span>
//           </div>
//         ) : null}
//       </FormSection>

//       {rol.data && permisos.data ? (
//         <FormSection title="Permisos del rol" fullWidth>
//           <div className="space-y-3">
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
//               <div className="md:col-span-7">
//                 <InputBase
//                   label="Buscar permiso"
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                   placeholder="Buscar por nombre o descripción..."
//                 />
//               </div>

//               <div className="md:col-span-5 flex md:justify-end">
//                 {canAssign ? (
//                   <ButtonBase
//                     type="button"
//                     color="secondary" // amarillo (como venían quedando los “Guardar/Sync”)
//                     disabled={!canSync}
//                     isLoading={guardar.loading}
//                     onClick={() => guardarPermisos(guardar, setGuardar, rol)}
//                   >
//                     Sincronizar permisos de rol
//                   </ButtonBase>
//                 ) : null}
//               </div>
//             </div>

//             <Table
//               rows={model.rows}
//               columns={model.columns}
//               getRowId={(r, i) => r?.id ?? i}
//               maxHeightClassName="max-h-[500px]"
//               emptyText="Sin resultados"
//             />
//           </div>
//         </FormSection>
//       ) : null}

//       {roles.error ? <div className="text-sm text-danger-700">{String(roles.error)}</div> : null}
//       {rol.error ? <div className="text-sm text-danger-700">{String(rol.error)}</div> : null}
//       {permisos.error ? <div className="text-sm text-danger-700">{String(permisos.error)}</div> : null}
//       {guardar.error ? <div className="text-sm text-danger-700">{String(guardar.error)}</div> : null}
//     </Container>
//   );
// }
