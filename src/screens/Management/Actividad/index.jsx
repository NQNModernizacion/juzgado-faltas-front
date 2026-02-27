import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../../context";
import { getActivity, dataTableModel } from "./handlers";

import {
  Container,
  ButtonBase,
  Modal,
  ModalHeader,
  ModalContent,
  Table,
  InputBase,
} from "muni-ui";

export default function Actividad() {
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();

  const [actividad, setActividad] = useState({
    data: null,
    error: null,
    loading: false,
  });

  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [propsData, setPropsData] = useState(null);

  useEffect(() => {
    if (!(actions.hasPermission("admin.activity.log") && actions.isAdmin())) {
      navigate(actions.isAdmin() ? "/administrador/roles-permisos" : "/");
      return;
    }
    getActivity(actividad, setActividad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const model = useMemo(() => {
    const { columns, rows, filter } = dataTableModel(actividad.data ?? [], (p) => {
      setPropsData(p);
      setOpen(true);
    });

    const filteredRows = q.trim() ? rows.filter((r) => filter(r, q)) : rows;

    // Adaptamos SOLO la columna "propiedades" para renderizar ButtonBase acá (en JSX)
    const columnsWithActions = columns.map((c) => {
      if (c.id !== "propiedades") return c;

      return {
        ...c,
        render: (row) => (
          <ButtonBase
            type="button"
            size="sm"
            color="primary"
            onClick={() => {
              setPropsData(row.propiedades);
              setOpen(true);
            }}
          >
            Ver cambios
          </ButtonBase>
        ),
      };
    });

    return { columns: columnsWithActions, rows: filteredRows };
  }, [actividad.data, q]);

  return (
    <Container linkBack="/administrador/roles-permisos" title="Logs de Actividad" className="space-y-4">
      {/* buscador */}
      <div className="max-w-md">
        <InputBase
          label="Buscar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre, descripción, evento..."
        />
      </div>

      {actividad.loading ? (
        <div className="flex justify-center py-2">
          <span className="mx-spinner" aria-hidden="true" />
        </div>
      ) : null}

      {!actividad.loading && actividad.error ? (
        <div className="mx-surface mx-surface-pad">
          <div className="text-sm font-semibold text-danger-700">{actividad.error}</div>
        </div>
      ) : null}

      {!actividad.loading && !actividad.error && model.rows?.length ? (
        <Table
          rows={model.rows}
          columns={model.columns}
          getRowId={(r, i) => r?.id ?? i}
          maxHeightClassName="max-h-[500px]"
        />
      ) : null}

      {!actividad.loading && !actividad.error && !model.rows?.length ? (
        <div className="text-sm text-muted">Sin resultados</div>
      ) : null}

      {/* Modal atributos */}
      <Modal open={open} onOpenChange={setOpen} size="lg">
        <ModalHeader
          title="Atributos"
          right={
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10"
              aria-label="Cerrar"
            >
              ✕
            </button>
          }
        />
        <ModalContent className="space-y-4">
          {propsData?.old ? <KV title="Old" data={propsData.old} /> : null}
          {propsData?.attributes ? <KV title="Attributes" data={propsData.attributes} /> : null}
          {!propsData?.old && !propsData?.attributes ? (
            <div className="text-sm text-muted">Sin datos para mostrar.</div>
          ) : null}
        </ModalContent>
      </Modal>
    </Container>
  );
}

function KV({ title, data }) {
  return (
    <div className="mx-surface mx-surface-pad">
      <div className="mb-2 text-sm font-semibold text-primary-700">{title}</div>
      <pre className="overflow-auto text-xs text-text whitespace-pre-wrap">
        {Object.entries(data)
          .map(([k, v]) => `${k}=${String(v)}`)
          .join("\n")}
      </pre>
    </div>
  );
}
