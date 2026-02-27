import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { toastOptions } from "../../config/toast";
import { prioridades } from "./exampleData";

import {
  Container,
  Modal,
  ModalHeader,
  ModalContent,
  ButtonBase,
  CheckboxBase,
  FileInputBase,
  RHFInput,
  SwitchBase,
  TextareaBase,
  InputBase,
  SelectBase,
  TableModal,
  FormSection,
  type TableColumn,
} from "muni-ui";

import AlertView from "./AlertView";
import CardView from "./CardView";
import FormView from "./FormView";
import BadgeView from "./BadgeView";
import { useNavigate } from "react-router-dom";

type ModalOptions = "ejemplo-tabla" | "ejemplo-form" | null;
type FormValues = { email: string };

const DevScreen = () => {
  const [selectedOption, setSelectedOption] = useState<ModalOptions>(null);

  const [sw, setSw] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const nav = useNavigate()
  // ---- TableModal state (muni-ui) ----
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0); // 0-based
  const [rpp, setRpp] = useState(10);

  const prioridadColumns = useMemo<
    Array<TableColumn<(typeof prioridades)[number]>>
  >(
    () => [
      {
        id: "avatar",
        header: "",
        align: "center",
        headerClassName: "w-[64px]",
        cellClassName: "w-[64px]",
        render: () => <span className="text-sm font-semibold">H2</span>,
      },
      { id: "name", header: "Name", render: (row) => row.name },
      { id: "label", header: "Label", render: (row) => row.label },
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return prioridades;

    const terms = s.split(/\s+/).filter(Boolean);
    return prioridades.filter((r) => {
      const hay = `${r.name ?? ""} ${r.label ?? ""} ${r.value ?? ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [q]);

  const modalConfig = {
    "ejemplo-tabla": {
      title: "Tabla ejemplo",
      content: (
        <TableModal
          open={selectedOption === "ejemplo-tabla"}
          onOpenChange={(open) =>
            setSelectedOption(open ? "ejemplo-tabla" : null)
          }
          title="Tabla ejemplo"
          rows={filtered}
          columns={prioridadColumns}
          getRowId={(r) => r.id}
          searchValue={q}
          onSearchChange={(v) => {
            setQ(v);
            setPage(0);
          }}
          page={page}
          rowsPerPage={rpp}
          onPageChange={setPage}
          onRowsPerPageChange={setRpp}
          emptyText="Sin resultados"
        />
      ),
    },
    "ejemplo-form": {
      title: "Ejemplo de Formulario",
      content: <FormView onCancel={() => setSelectedOption(null)} />,
    },
  } as const;

  const showToast = () => {
    toast.success("success", toastOptions);
    toast.warning("warning", toastOptions);
    toast.error("error", toastOptions);
  };

  const { control } = useForm<FormValues>({
    defaultValues: { email: "" },
  });

  const opciones = [
    { label: "Alta", value: "alta" },
    { label: "Media", value: "media" },
    { label: "Baja", value: "baja" },
  ];

  const openModal = (key: Exclude<ModalOptions, null>) => setSelectedOption(key);
  const closeModal = () => setSelectedOption(null);

  return (
    <>
      <Container
        linkBack="#/"
        title="Componentes"
        subtitle="Vista para mostrar componentes y ejemplos"
        className="space-y-6"
      >
       <div></div> <ButtonBase color="primary" onClick={() => nav("/")}>Volver</ButtonBase>
        {/* Acciones (TODAS coral) */}
        <div className="flex flex-wrap gap-3">
          <ButtonBase color="primary" onClick={showToast}>
            Mostrar Toasts
          </ButtonBase>

          <ButtonBase color="primary" onClick={() => openModal("ejemplo-tabla")}>
            Ejemplo Tabla
          </ButtonBase>

          <ButtonBase color="primary" onClick={() => openModal("ejemplo-form")}>
            Ejemplo de formulario
          </ButtonBase>
        </div>

        {/* Controles: usar fullWidth para que NO se achique por el grid interno de FormSection */}
        <FormSection title="Controles" fullWidth>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FileInputBase
              label="Archivo"
              value={file}
              onValueChange={(v) =>
                setFile((Array.isArray(v) ? v[0] : v) as File | null)
              }
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              helperText="Subí un PDF/imagen/txt"
              preview
            />

            <RHFInput
              control={control}
              name="email"
              label="Email"
              placeholder="tu@email.com"
            />

            <InputBase label="Input" placeholder="Texto..." />

            <SelectBase
              label="Prioridad"
              options={opciones}
              placeholder="Elegí una prioridad"
            />

            <TextareaBase label="Textarea" placeholder="Escribí algo..." />

            <div className="flex items-center gap-4">
              <CheckboxBase label="Checkbox" />
              <SwitchBase checked={sw} onCheckedChange={setSw} label="Switch" />
            </div>
          </div>
        </FormSection>

        <CardView />
        <AlertView />
        <BadgeView />
      </Container>

      {/* Solo usamos Modal para el "ejemplo-form".
          El "ejemplo-tabla" ya renderiza su propio Modal internamente (TableModal) */}
      <Modal
        open={selectedOption === "ejemplo-form"}
        onOpenChange={(open) => (open ? setSelectedOption("ejemplo-form") : closeModal())}
        size="lg"
      >
        <ModalHeader
          title={modalConfig["ejemplo-form"].title}
          right={
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg px-2 py-1 text-primary-700/80 hover:text-primary-700 hover:bg-black/10"
              aria-label="Cerrar"
            >
              ✕
            </button>
          }
        />

        <ModalContent>{modalConfig["ejemplo-form"].content}</ModalContent>
      </Modal>

      {/* Tabla modal: ya está completa y con header propio */}
      {modalConfig["ejemplo-tabla"].content}
    </>
  );
};

export default DevScreen;
