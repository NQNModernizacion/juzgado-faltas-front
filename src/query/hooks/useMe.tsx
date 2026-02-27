import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/api/client";

export type MeResponse = {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
};

export const meKeys = {
  me: (token: string | null) => ["me", token] as const,
};

export function useMe(token: string | null) {
  return useQuery({
    queryKey: meKeys.me(token),
    enabled: !!token,
    queryFn: async () => {
      // IMPORTANTE: return explícito (blindaje contra “undefined”)
      const data = await apiGet<MeResponse>("me", token ?? undefined);
      return data;
    },
  });
}
