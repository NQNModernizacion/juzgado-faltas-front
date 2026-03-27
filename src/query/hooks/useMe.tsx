import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/api/auth";
import { useSessionStore } from "@/store/sessionStore";
import { authKeys } from "../authKeys";

export function useMe() {
  const token = useSessionStore((s) => s.token);

  return useQuery({
    queryKey: authKeys.me(token),
    queryFn: fetchMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}