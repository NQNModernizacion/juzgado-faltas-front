import { toast } from "react-toastify";
import { toastOptions } from "../../../config/toast";
import { axios } from "../../../utils/axios";

export const getActivity = async (actividad, setActividad) => {
  setActividad({ ...actividad, loading: true, error: null });

  try {
    const response = await axios().get("/actividad");
    const payload = response?.data ?? {};
    const { data, error } = payload;

    if (data && !error) {
      setActividad({ ...actividad, loading: false, data });
      toast.success("Actividad cargada", toastOptions);
      return;
    }

    setActividad({
      ...actividad,
      loading: false,
      error: error ?? "Error desconocido",
    });
    toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e) {
    setActividad({
      ...actividad,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

export const dataTableModel = (data, onViewProps) => {
  // rows 
  const rows = (data ?? []).map((d) => ({
    id: d.id,
    name: d.log_name,
    descripcion: d.description,
    objetivo: d.subject_type,
    evento: d.event,
    objetivo_id: d.subject_id,
    causante: d.causer_type,
    causante_id: d.causer_id,
    propiedades: d.properties,
    fecha: d.created_at,
  }));

  // filter
  const filter = (r, value) => {
    const v = (value ?? "").toLowerCase();
    return (
      (r.name ?? "").toLowerCase().includes(v) ||
      (r.descripcion ?? "").toLowerCase().includes(v) ||
      (r.objetivo ?? "").toLowerCase().includes(v) ||
      String(r.objetivo_id ?? "").toLowerCase().includes(v) ||
      (r.evento ?? "").toLowerCase().includes(v) ||
      (r.causante ?? "").toLowerCase().includes(v) ||
      String(r.causante_id ?? "").toLowerCase().includes(v)
    );
  };

  // columns para muni-ui Table:
  const columns = [
    { id: "descripcion", header: "Descripción", render: (r) => r.descripcion ?? "-" },
    { id: "objetivo", header: "Modelo objetivo", render: (r) => r.objetivo ?? "-" },
    { id: "objetivo_id", header: "Id objetivo", render: (r) => String(r.objetivo_id ?? "-") },
    { id: "evento", header: "Evento", render: (r) => r.evento ?? "-" },
    { id: "causante", header: "Modelo causante", render: (r) => r.causante ?? "-" },
    { id: "causante_id", header: "Id causante", render: (r) => String(r.causante_id ?? "-") },
    {
      id: "propiedades",
      header: "Propiedades",
      align: "center",
      // acá devolvemos una marca que el componente usará para renderizar botón
      render: (r) => ({ __action: "view_props", payload: r.propiedades }),
    },
    {
      id: "fecha",
      header: "Fecha",
      render: (r) => {
        if (!r.fecha) return "-";
        const date = new Date(r.fecha);
        return date.toLocaleString();
      },
    },
  ];

  return { columns, rows, filter };
};
