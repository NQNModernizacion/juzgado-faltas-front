import { ButtonBase } from "muni-ui";

type PersonaInfo = {
  dni?: number;
  nombres?: string;
  apellidos?: string;
  user_id?: number;

  // opcionales por si en otros flujos todavía vienen con nombres viejos
  documento?: number;
  usuarioID?: number;

  nombreCompleto?: string;
  correoElectronico?: string;
};

const InfoPerson = ({
  persona,
  onSelect,
}: {
  persona: PersonaInfo | null;
  onSelect: () => void;
}) => {
  if (!persona) return null;

  const fullName =
    persona.nombreCompleto ??
    `${persona.apellidos ?? ""} ${persona.nombres ?? ""}`.trim();

  // ✅ soporta ambos nombres (nuevo y legacy)
  const dni = persona.dni ?? persona.documento ?? null;
  const userId = persona.user_id ?? persona.usuarioID ?? null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-text sm:text-xl">{fullName || "-"}</h2>

        <p className="mt-1 text-sm font-medium text-muted break-words">
          DNI: {dni ?? "-"} · UserID: {userId ?? "-"}
        </p>

        {!!persona.correoElectronico ? (
          <p className="mt-1 text-sm text-muted break-words">{persona.correoElectronico}</p>
        ) : null}
      </div>

      <div className="shrink-0">
        <ButtonBase type="button" onClick={onSelect}>
          Seleccionar
        </ButtonBase>
      </div>
    </div>
  );
};

export default InfoPerson;