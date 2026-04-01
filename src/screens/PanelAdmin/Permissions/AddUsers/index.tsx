import React, { useContext, useMemo, useState } from "react";
import { ButtonBase, InputBase } from "@nqnmodernizacion/muni-ui";
import { toast } from "react-toastify";
import { toastOptions } from "@/config/toast";

import { UserContext } from "@/context/UserWrapper";
import { userKeys } from "@/query/keys";
import { useUserByDni } from "@/query/hooks/useUserByDni";
import { useQueryClient } from "@tanstack/react-query";

import InfoPerson from "./InfoPerson";
import { useSessionStore } from "@/store/sessionStore";

type PersonaInfo = {
  dni: number;
  nombres: string;
  apellidos: string;
  user_id: number;
};

type UserAccess = {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
};

interface Props {
  show: boolean;
  onUserSelect: (user: any) => void;
}

const AddUsers: React.FC<Props> = ({ show, onUserSelect }) => {
const tokenKey = useSessionStore((s) => s.token) ?? null;

  const qc = useQueryClient();

  const [dni, setDni] = useState("");

  const dniClean = useMemo(() => String(dni ?? "").replace(/\D/g, ""), [dni]);

  //  enabled:false → NO dispara al tipear, solo con refetch()
  const q = useUserByDni({ tokenKey, dni: dniClean, enabled: false });

  const persona: PersonaInfo | null = (q.data?.persona as any) ?? null;
  const userAccess: UserAccess | null = (q.data?.user as any) ?? null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dniClean) {
      toast.error("Ingresá un DNI válido", toastOptions);
      return;
    }

    const res = await q.refetch();

    if (res.error) {
      const msg =
        (res.error as any)?.response?.data?.error ??
        (res.error as any)?.message ??
        "Error consultando DNI";
      toast.error(msg, toastOptions);
      return;
    }

    if (!res.data?.user) {
      toast.info("La persona no tiene usuario en la tabla users (local)", toastOptions);
    }
  };

  const resetLocal = () => {
    // limpia input
    setDni("");

    // limpia el resultado visible (remueve cache del dni buscado)
    if (dniClean) {
      qc.removeQueries({ queryKey: userKeys.byDni(tokenKey, dniClean) });
    }
  };

  const handleSelectPerson = () => {
    if (!persona) return;

    if (!userAccess?.id) {
      toast.error("No se puede seleccionar: no existe usuario local", toastOptions);
      return;
    }

    const selectedUser = {
      id: userAccess.id,
      email: userAccess.email,
      persona,

      //  esto sirve para precargar selects
      role_names: userAccess.roles ?? [],
      permission_names: userAccess.permissions ?? [],

      // opcional legacy 
      roles: (userAccess.roles ?? []).map((name) => ({
        id: -1,
        name,
        description: name,
      })),
      permissions: (userAccess.permissions ?? []).map((name) => ({
        id: -1,
        name,
      })),
    };

    onUserSelect(selectedUser);

    //  deja el buscador limpio para la próxima búsqueda
    resetLocal();
  };

  if (!show) return null;

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex w-full flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[240px]">
          <InputBase
            control={undefined as any}
            name="dni"
            label="Número de DNI"
            value={dni}
            onChange={(e: any) => setDni(e?.target?.value ?? "")}
            className={{
              container: "w-full",
              label: "block text-sm font-semibold text-text",
            }}
          />
        </div>

        <ButtonBase type="submit" color="primary" disabled={q.isFetching} className="h-10 px-6">
          {q.isFetching ? "Buscando..." : "Buscar"}
        </ButtonBase>
      </form>

      {persona ? (
        <div className="mt-4">
          <InfoPerson persona={persona} onSelect={handleSelectPerson} />
        </div>
      ) : null}
    </div>
  );
};

export default AddUsers;