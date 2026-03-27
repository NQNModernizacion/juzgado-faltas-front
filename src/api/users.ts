import { apiGet } from "@/api/client";

// endpoints específicos de usuarios
export type UserListItem = { id: number };

export function fetchUsers() {
  return apiGet<UserListItem[]>("/usersList");
}
