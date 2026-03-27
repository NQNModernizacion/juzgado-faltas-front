import { useQuery } from "@tanstack/react-query";
import { fetchAdminBootstrap } from "@/api/admin";
import { adminKeys } from "../keys";

export function useAdminBootstrap(opts: { enabled: boolean; tokenKey: string | null }) {
  return useQuery({
    queryKey: adminKeys.bootstrap(opts.tokenKey),
    queryFn: fetchAdminBootstrap,
    enabled: opts.enabled, // ✅ boolean
    staleTime: 5 * 60 * 1000,
  });
}