import { axios } from "@/utils/axios";

type Envelope<T> = { data?: T; error?: any };

function isEnvelope<T>(v: any): v is Envelope<T> {
  return v && typeof v === "object" && ("data" in v || "error" in v);
}

function normalizeResponse<T>(body: any): T {
  // Caso A: { data, error }
  if (isEnvelope<T>(body)) {
    if (body.error) throw body.error;
    if (body.data === undefined) {
      throw new Error("Respuesta inválida: 'data' vino undefined");
    }
    return body.data as T;
  }

  // Caso B: respuesta plana
  if (body === undefined) {
    throw new Error("Respuesta inválida: body undefined");
  }
  return body as T;
}


export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await axios(token).get(path);
  console.log("[apiGet]", path, "status:", res.status, "body:", res.data);
  return normalizeResponse<T>(res.data);
}

export async function apiPost<T>(path: string, body?: any, token?: string): Promise<T> {
  const res = await axios(token).post(path, body);
  return normalizeResponse<T>(res.data);
}
