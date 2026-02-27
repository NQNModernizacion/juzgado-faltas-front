import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/api/users";

export const usersKeys = {
  all: ["users"] as const,
};

export function useUsers(enabled: boolean) {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: fetchUsers,
    enabled,
  });
}

