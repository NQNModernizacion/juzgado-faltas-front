import { apiGet } from "@/api/client";

export type MeResponse = {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
};

export function fetchMe() {
  return apiGet<MeResponse>("me")
}
