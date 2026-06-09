import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest, refreshTokenRequest } from "@/api/auth";
import { authKeys } from "../authKeys";
import { adminKeys } from "../keys";

export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth"] });
      await qc.invalidateQueries({ queryKey: ["admin-bootstrap"] });
    },
  });
}

export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: refreshTokenRequest,
  });
}

export function clearSessionQueries() {
  return [
    ["auth"],
    ["admin-bootstrap"],
    ["user-by-dni"],
    ["users"],
  ] as const;
}