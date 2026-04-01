import { toast } from "react-toastify";
import { toastOptions } from "../../../config/toast";
import { axios } from "../../../utils/axios";
import { CheckboxBase } from "@nqnmodernizacion/muni-ui";

/** ====== API ====== */

export const getPermisos = async (
  permisos,
  setPermisos,
  listado,
  setListado,
  perms
) => {
  setPermisos({ ...permisos, loading: true, data: null, error: null });

  try {
    const response = await axios().get("/permisos");
    const { data, error } = response?.data ?? {};

    if (data && !error) {
      setPermisos({ ...permisos, loading: false, data });
      toast.success("Permisos cargados", toastOptions);

      // perms = ids seleccionados (ya venía en tu lógica)
      setListado({ ...listado, permisos: data, permisos_select: perms });
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

export const consultar_persona = async (
  e,
  persona,
  setPersona,
  setListado,
  listado,
  setPermisos,
  permisos
) => {
  e.preventDefault();

  setListado({
    ...listado,
    permisos_asign: [],
    permisos_no_asign: [],
    permisos_select: [],
  });

  setPersona({ ...persona, loading: true, data: null, error: null });

  try {
    const response = await axios().post("/buscar_persona", {
      data: persona.values.data,
    });

    const { data, error } = response?.data ?? {};

    if (data && !error) {
      setPersona({ ...persona, loading: false, data });

      // ids de permisos ya asignados
      const selectedIds = (data.permisos ?? []).map((item) => item.id);

      // cargar catálogo y setear selección
      await getPermisos(permisos, setPermisos, listado, setListado, selectedIds);
      return;
    }

    setPersona({ ...persona, data: null, loading: false, error: error ?? "Error desconocido" });

    if (error?.general) toast.error(error.general, toastOptions);
    else toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e2) {
    setPersona({
      ...persona,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

export const GuardarPermisos = async (
  persona,
  guardarPermisos,
  setGuardarPermisos,
  permisosSelect,
  permisos,
  setPermisos,
  listado,
  setListado
) => {
  setGuardarPermisos({ ...guardarPermisos, loading: true, error: null });

  try {
    const response = await axios().post("/sincronizarPermisos", {
      user_id: persona.data.user.usuarioID,
      permisos_id: permisosSelect,
    });

    const { data, error } = response?.data ?? {};

    if (data && !error) {
      setGuardarPermisos({ ...guardarPermisos, loading: false, data });
      toast.success("Permisos actualizados", toastOptions);
      return;
    }

    setGuardarPermisos({ ...guardarPermisos, loading: false, error: error ?? "Error desconocido" });
    toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e) {
    setGuardarPermisos({
      ...guardarPermisos,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

/** ====== helpers selección (misma lógica que tu versión) ====== */

const seleccionar = (checked, value, listado, setListado) => {
  const id = parseInt(value, 10);

  if (checked) {
    const list = Array.isArray(listado.permisos_select) ? [...listado.permisos_select] : [];
    if (!list.includes(id)) list.push(id);
    setListado({ ...listado, permisos_select: list });
  } else {
    const list = Array.isArray(listado.permisos_select) ? listado.permisos_select : [];
    const next = list.filter((item) => item !== id);
    setListado({ ...listado, permisos_select: next });
  }
};

const tiene_permiso = (nombre, persona) => {
  let tiene = false;
  (persona?.data?.permisos ?? []).forEach((item) => {
    if (item.name === nombre) tiene = true;
  });
  return tiene;
};

/** ====== Table model muni-ui (reemplaza DataGrid) ====== */
export const tablePermisosModel = (data, listado, setListado, persona, actions) => {
  const canAssign = actions.hasPermission("admin.permission.asign");

  const rows = (data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
  }));

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
                  // checkbox base: lo manejamos como “defaultChecked + onChange”
                  // para mantener lo más parecido a tu implementación actual
                  defaultChecked={tiene_permiso(row.name, persona)}
                  onCheckedChange={(checked) => {
                    seleccionar(!!checked, row.id, listado, setListado);
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
