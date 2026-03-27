export const adminKeys = {
  bootstrap: (tokenKey: string | null) =>
    ["admin-bootstrap", tokenKey] as const,
};

export const userKeys = {
  byDni: (tokenKey: string | null, dni: string) =>
    ["user-by-dni", tokenKey, dni] as const,
};

export const usersKeys = {
  all: ["users"] as const,
};