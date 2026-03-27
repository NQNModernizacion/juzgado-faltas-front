import { apiGet, apiPost } from "@/api/client";

export type MeResponse = {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
};

export type LoginBody = {
  _id: string;
  password: string;
  type?: "internal";
};

export type LoginUser = {
  id: number;
  email?: string;
  roles?: string[];
  permissions?: string[];
};

export type LoginResponse = {
  token: string;
  token_type: string;
  expires_at: string | null;
  user: LoginUser | null;
};

export type RefreshResponse = {
  refreshed: boolean;
  access_token?: string;
  token_type?: string;
  expires_at?: string | null;
};

export function fetchMe() {
  return apiGet<MeResponse>("me");
}

export function loginRequest(body: LoginBody) {
  return apiPost<LoginResponse>("auth", {
    ...body,
    type: "internal",
  });
}

export function refreshTokenRequest() {
  return apiPost<RefreshResponse>("refresh");
}