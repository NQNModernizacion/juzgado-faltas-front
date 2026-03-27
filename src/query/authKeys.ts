export const authKeys = {
  me: (token: string | null) => ["auth", "me", token] as const,
};