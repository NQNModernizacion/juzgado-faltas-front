import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/api/users";
import { usersKeys } from "../keys";

export function useUsers(enabled: boolean) {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: fetchUsers,
    enabled,
  });
}