import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/api/client";
import { useSessionStore } from "@/store/sessionStore";

export type MeResponse = {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
};

export const meKeys = {
  me: (token: string | null) => ["me", token] as const,
};

export function useMe() {
  const token = useSessionStore((s) => s.token);

  return useQuery({
    queryKey: meKeys.me(token),
    enabled: !!token,
    queryFn: async () => {
      return await apiGet<MeResponse>("me");
    },
    staleTime: 5 * 60 * 1000,
  });
}