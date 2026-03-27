import { toast } from "react-toastify";
import { toastOptions } from "../../../config/toast";
import { axios } from "../../../utils/axios";

/** Trae usuarios */
export const getUsers = async (usuarios, setUsuarios) => {
  setUsuarios({ ...usuarios, loading: true, error: null });

  try {
    const response = await axios().get("/usersList");
    const { data, error } = response?.data ?? {};

    if (data && !error) {
      setUsuarios({ ...usuarios, loading: false, data });
      toast.success("Usuarios cargados", toastOptions);
      return;
    }

    setUsuarios({
      ...usuarios,
      loading: false,
      error: error ?? "Error desconocido",
    });
    toast.error(error ?? "Error desconocido", toastOptions);
  } catch (e) {
    setUsuarios({
      ...usuarios,
      loading: false,
      error: "Hubo un error durante la consulta",
    });
    toast.error("Hubo un error durante la consulta", toastOptions);
  }
};

/** Model para muni-ui Table */
export const tableUsuariosModel = (data) => {
  const rows = (data ?? []).map((d) => ({
    id: d.id,
  }));

  const columns = [
    {
      id: "id",
      header: "ID",
      headerClassName: "w-[120px]",
      cellClassName: "w-[120px]",
      render: (r) => String(r.id ?? "-"),
    },
  ];

  const filter = (row, value) => {
    const v = (value ?? "").toLowerCase();
    return String(row.id ?? "").toLowerCase().includes(v);
  };

  return { columns, rows, filter };
};
