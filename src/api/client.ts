import { axios } from "@/utils/axios";
import { log } from "@/utils/logger";

type Envelope<T> = { data?: T; error?: any };

function isEnvelope<T>(v: any): v is Envelope<T> {
  return v && typeof v === "object" && ("data" in v || "error" in v);
}

function normalizeResponse<T>(body: any): T {
  if (isEnvelope<T>(body)) {
    if (body.error) throw body.error;
    if (body.data === undefined) {
      throw new Error("Respuesta inválida: 'data' vino undefined");
    }
    return body.data as T;
  }

  if (body === undefined) {
    throw new Error("Respuesta inválida: body undefined");
  }

  return body as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await axios().get(path);
  log.info("[apiGet]", path, "status:", res.status, "body:", res.data);
  return normalizeResponse<T>(res.data);
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  const res = await axios().post(path, body);
  log.info("[apiPost]", path, "status:", res.status, "body:", res.data);
  return normalizeResponse<T>(res.data);
}

export async function apiPut<T>(path: string, body?: any): Promise<T> {
  const res = await axios().put(path, body);
  log.info("[apiPut]", path, "status:", res.status, "body:", res.data);
  return normalizeResponse<T>(res.data);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await axios().delete(path);
  log.info("[apiDelete]", path, "status:", res.status, "body:", res.data);
  return normalizeResponse<T>(res.data);
}