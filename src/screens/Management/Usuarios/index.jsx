// import { useContext, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { UserContext } from "./../../../context";
// import { getUsers, tableUsuariosModel } from "./handlers";

// import { Container, Table, InputBase, FormSection } from "muni-ui";

// export default function Usuarios() {
//   const { actions } = useContext(UserContext);
//   const navigate = useNavigate();

//   const [usuarios, setUsuarios] = useState({
//     data: null,
//     error: null,
//     loading: false,
//   });

//   const [q, setQ] = useState("");

//   useEffect(() => {
//     if (!(actions.hasPermission("admin.users.view") && actions.isAdmin())) {
//       // respetamos tu lógica original (role admin -> panel, sino home)
//       if (actions.hasRole("admin")) navigate("/administrador/roles-permisos");
//       else navigate("/");
//       return;
//     }

//     getUsers(usuarios, setUsuarios);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const model = useMemo(() => {
//     const base = tableUsuariosModel(usuarios.data ?? []);
//     const rows = q.trim() ? base.rows.filter((r) => base.filter(r, q)) : base.rows;
//     return { columns: base.columns, rows };
//   }, [usuarios.data, q]);

//   return (
//     <Container
//       linkBack="/administrador/roles-permisos"
//       title="Usuarios que utilizaron la app"
//       className="space-y-4"
//     >
//       {usuarios.loading ? (
//         <div className="flex justify-center py-2">
//           <span className="mx-spinner" aria-hidden="true" />
//         </div>
//       ) : null}

//       {usuarios.error ? (
//         <div className="mx-surface mx-surface-pad">
//           <div className="text-sm font-semibold text-danger-700">
//             {String(usuarios.error)}
//           </div>
//         </div>
//       ) : null}

//       {usuarios.data ? (
//         <FormSection title="Listado" fullWidth>
//           <div className="space-y-3">
//             <InputBase
//               label="Buscar"
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Buscar por ID..."
//             />

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
//     </Container>
//   );
// }
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { UserContext } from "./../../../context";
import { Container, Table, InputBase, FormSection } from "muni-ui";
import { useUsers } from "@/query/hooks/useUsers";
import { toastOptions } from "@/config/toast";

export default function Usuarios() {
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const canView = actions.hasPermission("admin.users.view") && actions.isAdmin();

  // Si no tiene permisos, redirigimos 
  if (!canView) {
    if (actions.hasRole("admin")) navigate("/administrador/roles-permisos");
    else navigate("/");
  }

  const { data, isLoading, isError, error } = useUsers(canView);

  //  mostrar toast si hay error
  if (isError) {
    toast.error(typeof error === "string" ? error : "Error al cargar usuarios", toastOptions);
  }

  const model = useMemo(() => {
    const rows = (data ?? []).map((u) => ({ id: u.id }));
    const filtered =
      q.trim() ? rows.filter((r) => String(r.id).toLowerCase().includes(q.trim().toLowerCase())) : rows;

    const columns = [
      {
        id: "id",
        header: "ID",
        headerClassName: "w-[120px]",
        cellClassName: "w-[120px]",
        render: (r: any) => String(r.id ?? "-"),
      },
    ];

    return { rows: filtered, columns };
  }, [data, q]);

  return (
    <Container linkBack="/administrador/roles-permisos" title="Usuarios que utilizaron la app" className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-2">
          <span className="mx-spinner" aria-hidden="true" />
        </div>
      ) : null}

      <FormSection title="Listado" fullWidth>
        <div className="space-y-3">
          <InputBase
            label="Buscar"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ID..."
          />

          <Table
            rows={model.rows}
            columns={model.columns}
            getRowId={(r: any, i: number) => r?.id ?? i}
            maxHeightClassName="max-h-[500px]"
            emptyText="Sin resultados"
          />
        </div>
      </FormSection>
    </Container>
  );
}

