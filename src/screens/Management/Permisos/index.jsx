// import { useContext, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { UserContext } from "../../../context";
// import {
//   consultar_persona,
//   GuardarPermisos,
//   tablePermisosModel,
// } from "./handlers";

// import {
//   Container,
//   ButtonBase,
//   InputBase,
//   Table,
//   FormSection,
// } from "muni-ui";

// export default function Permisos() {
//   const navigate = useNavigate();
//   const { actions } = useContext(UserContext);

//   const [permisos, setPermisos] = useState({
//     data: null,
//     error: null,
//     loading: false,
//   });

//   const [listado, setListado] = useState({
//     permisos: [],
//     permisos_asign: [],
//     permisos_no_asign: [],
//     permisos_select: [],
//   });

//   const [guardarPermisos, setGuardarPermisos] = useState({
//     data: null,
//     error: null,
//     loading: false,
//   });

//   const [persona, setPersona] = useState({
//     data: null,
//     error: null,
//     loading: false,
//     values: { data: "" },
//   });

//   const [q, setQ] = useState("");

//   useEffect(() => {
//     if (!(actions.hasPermission("admin.permission.view") && actions.isAdmin())) {
//       navigate(actions.isAdmin() ? "/administrador/roles-permisos" : "/");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const onSubmitBuscar = (e) =>
//     consultar_persona(
//       e,
//       persona,
//       setPersona,
//       setListado,
//       listado,
//       setPermisos,
//       permisos
//     );

//   const model = useMemo(() => {
//     const base = tablePermisosModel(permisos.data ?? [], listado, setListado, persona, actions);
//     const rows = q.trim() ? base.rows.filter((r) => base.filter(r, q)) : base.rows;
//     return { columns: base.columns, rows };
//   }, [permisos.data, listado, persona, actions, q]);

//   const canAssign = actions.hasPermission("admin.permission.asign");
//   const canSync =
//     canAssign &&
//     !!persona.data &&
//     (listado.permisos_select?.length ?? 0) > 0 &&
//     !guardarPermisos.loading;

//   return (
//     <Container linkBack="/administrador/roles-permisos" title="Administración de Permisos" className="space-y-4">
//       <form onSubmit={onSubmitBuscar} className="space-y-4">
//         <FormSection title="Buscar persona" fullWidth>
//           <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
//             <div className="md:col-span-9">
//               <InputBase
//                 label="Ingrese DNI, ID o Email"
//                 value={persona.values.data}
//                 onChange={(e) =>
//                   setPersona((prev) => ({ ...prev, values: { data: e.target.value } }))
//                 }
//               />
//             </div>

//             <div className="md:col-span-3">
//               <ButtonBase
//                 type="submit"
//                 color="primary"
//                 className="w-full"
//                 disabled={persona.loading}
//                 isLoading={persona.loading}
//               >
//                 Buscar
//               </ButtonBase>
//             </div>
//           </div>

//           {persona.loading ? (
//             <div className="flex justify-center py-2">
//               <span className="mx-spinner" aria-hidden="true" />
//             </div>
//           ) : null}
//         </FormSection>

//         {persona.data ? (
//           <div className="mx-surface mx-surface-pad">
//             <div className="text-base font-semibold text-text">
//               {persona.data.user?.nombre}
//             </div>
//             <div className="mt-1 text-sm text-muted">
//               Correo: {persona.data.user?.correoElectronico}
//             </div>
//             <div className="text-sm text-muted">
//               Documento: {persona.data.user?.documento}
//             </div>
//             <div className="text-sm text-muted">
//               ¿Ha entrado a la aplicación?: {persona.data.in_app ? "Sí" : "No"}
//             </div>
//           </div>
//         ) : null}

//         {persona.data ? (
//           <FormSection title="Permisos" subtitle="Seleccioná permisos y sincronizá" fullWidth>
//             <div className="space-y-3">
//               {/* Toolbar */}
//               <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
//                 <div className="md:col-span-7">
//                   <InputBase
//                     label="Buscar permiso"
//                     value={q}
//                     onChange={(e) => setQ(e.target.value)}
//                     placeholder="Buscar por nombre o descripción..."
//                   />
//                 </div>

//                 <div className="md:col-span-5 flex md:justify-end">
//                   {canAssign ? (
//                     <ButtonBase
//                       type="button"
//                       color="secondary"
//                       disabled={!canSync}
//                       isLoading={guardarPermisos.loading}
//                       onClick={() =>
//                         GuardarPermisos(
//                           persona,
//                           guardarPermisos,
//                           setGuardarPermisos,
//                           listado.permisos_select,
//                           permisos,
//                           setPermisos,
//                           listado,
//                           setListado
//                         )
//                       }
//                     >
//                       Sincronizar permisos seleccionados
//                     </ButtonBase>
//                   ) : null}
//                 </div>
//               </div>

//               {permisos.loading && permisos.data === null ? (
//                 <div className="flex justify-center py-2">
//                   <span className="mx-spinner" aria-hidden="true" />
//                 </div>
//               ) : null}

//               {permisos.error ? (
//                 <div className="mx-surface mx-surface-pad">
//                   <div className="text-sm font-semibold text-danger-700">
//                     {String(permisos.error)}
//                   </div>
//                 </div>
//               ) : null}

//               <Table
//                 rows={model.rows}
//                 columns={model.columns}
//                 getRowId={(r, i) => r?.id ?? i}
//                 maxHeightClassName="max-h-[500px]"
//                 emptyText="Sin resultados"
//               />
//             </div>
//           </FormSection>
//         ) : null}
//       </form>
//     </Container>
//   );
// }
