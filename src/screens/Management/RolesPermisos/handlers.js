import { toast } from "react-toastify";
import { toastOptions } from "../../../config/toast";
import { axios } from "../../../utils/axios";
import { CheckboxBase } from "muni-ui";

/** Roles */
export const getRoles = async (roles, setRoles) => {
  setRoles({ ...roles, loading: true, error: null });

  try {
    const response = await axios().get("/roles");
    const { data, error } = response?.data ?? {};

    if (data && !error) {
      toast.success("Roles cargados", toastOptions);

      const listado = (data ?? []).map((item) => ({
        ...item,
        label: item.name, // react-select style
      }));

      setRoles({ ...roles, loading: false, data: listado });
      return;
    }

    setRoles({ ...roles, loading: false, error: error ?? "Error desconocido" });
    toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e) {
    setRoles({
      ...roles,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

/** Trae permisos del rol seleccionado */
export const buscarRol = async (rol, setRol, permisos, setPermisos) => {
  setPermisos({ ...permisos, data: null, error: null });
  setRol({ ...rol, loading: true, error: null });

  try {
    const roleId = rol?.rol?.[0]?.id;
    const response = await axios().get("/roles/" + roleId);

    const { data, error } = response?.data ?? {};

    if (data && !error) {
      toast.success("Rol encontrado", toastOptions);

      const list = (data.permissions ?? []).map((p) => p.id);
      setRol({ ...rol, loading: false, data, permisos_rol: list });
      return;
    }

    setRol({ ...rol, loading: false, error: error ?? "Error desconocido" });
    toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e) {
    setRol({
      ...rol,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

/** Catálogo de permisos */
export const getPermisos = async (permisos, setPermisos) => {
  setPermisos({ ...permisos, loading: true, data: null, error: null });

  try {
    const response = await axios().get("/permisos");
    const { data, error } = response?.data ?? {};

    if (data && !error) {
      setPermisos({ ...permisos, loading: false, data });
      toast.success("Permisos cargados", toastOptions);
      return;
    }

    setPermisos({ ...permisos, loading: false, error: error ?? "Error desconocido" });
    toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e) {
    setPermisos({
      ...permisos,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

/** Guardar permisos asignados al rol */
export const guardarPermisos = async (guardar, setGuardar, rol) => {
  setGuardar({ ...guardar, loading: true, error: null });

  try {
    const response = await axios().post("/guardarPermisosRol", {
      permisos_id: rol.permisos_rol,
      rol_id: rol.data.id,
    });

    const { data, error } = response?.data ?? {};

    if (data && !error) {
      setGuardar({ ...guardar, loading: false, data });
      toast.success("Permisos sincronizados", toastOptions);
      return;
    }

    setGuardar({ ...guardar, loading: false, error: error ?? "Error desconocido" });
    toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e) {
    setGuardar({
      ...guardar,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

/** ====== Helpers selección ====== */
const asignarPermiso = (checked, value, rol, setRol) => {
  const id = parseInt(value, 10);
  const list = Array.isArray(rol.permisos_rol) ? [...rol.permisos_rol] : [];

  if (checked) {
    if (!list.includes(id)) list.push(id);
  } else {
    const idx = list.indexOf(id);
    if (idx >= 0) list.splice(idx, 1);
  }

  setRol({ ...rol, permisos_rol: list });
};

/** ====== Table model muni-ui ====== */
export const tablePermisosRolModel = (data, actions, rol, setRol) => {
  const canAssign = actions.hasPermission("admin.role-permission.asign");

  const rows = (data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
  }));

  const isChecked = (permId) => Array.isArray(rol.permisos_rol) && rol.permisos_rol.includes(permId);

  const columns = [
    ...(canAssign
      ? [
          {
            id: "accion",
            header: "Acción",
            align: "center",
            headerClassName: "w-[120px]",
            cellClassName: "w-[120px]",
            render: (row) => (
              <div className="flex justify-center">
                <CheckboxBase
                  checked={isChecked(row.id)}
                  onCheckedChange={(checked) => {
                    asignarPermiso(!!checked, row.id, rol, setRol);
                  }}
                />
              </div>
            ),
          },
        ]
      : []),
    { id: "name", header: "Nombre", render: (r) => r.name ?? "-" },
    { id: "description", header: "Descripción", render: (r) => r.description ?? "-" },
  ];

  const filter = (row, value) => {
    const v = (value ?? "").toLowerCase();
    return (
      String(row.id ?? "").toLowerCase().includes(v) ||
      (row.name ?? "").toLowerCase().includes(v) ||
      (row.description ?? "").toLowerCase().includes(v)
    );
  };

  return { columns, rows, filter };
};
