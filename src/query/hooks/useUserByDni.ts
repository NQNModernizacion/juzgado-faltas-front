import { useQuery } from "@tanstack/react-query";
import { fetchUserByDni } from "@/api/admin";
import { userKeys } from "../keys";

export function useUserByDni(opts: {
  tokenKey: string | null;
  dni: string;
  enabled?: boolean;
}) {
  const dniClean = String(opts.dni ?? "").replace(/\D/g, "");

  return useQuery({
    queryKey: userKeys.byDni(opts.tokenKey, dniClean),
    queryFn: () => fetchUserByDni(dniClean),
    enabled: opts.enabled ?? false,
    retry: 0,
    staleTime: 0,
  });
}