// services/http/apiClient.js
import { ApiError } from "./ApiError";
import { MENSAGENS_PADRAO } from "./errorMessages";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_TIMEOUT_MS = 15000;

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

async function lerCorpo(response) {
  const raw = await response.text().catch(() => "");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return { _raw: raw }; }
}

function mensagemDoServidor(data) {
  const msg = data?.message ?? data?.detail ?? data?.error;
  if (typeof msg !== "string") return null;
  const t = msg.trim();
  return t && t.length <= 200 && !t.startsWith("<") ? t : null;
}

// Aceita { errors: [{field, message}] }, { errors: {campo: msg} } ou { fieldErrors: ... }
function extrairErrosDeCampo(data) {
  const e = data?.errors ?? data?.fieldErrors;
  if (!e) return null;
  if (Array.isArray(e)) {
    return Object.fromEntries(
      e.filter((x) => x?.field).map((x) => [x.field, x.message ?? x.defaultMessage ?? "Valor inválido"])
    );
  }
  return typeof e === "object" ? e : null;
}

export async function request(path, {
  method = "GET",
  json,                 // objeto → JSON
  formData,             // FormData → multipart
  messages = {},        // mensagens específicas por status deste endpoint
  timeout = DEFAULT_TIMEOUT_MS,
  skipAuthRedirect = false, // true no login (401 aqui é "senha errada")
  signal,
} = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeout);
  signal?.addEventListener("abort", () => controller.abort(signal.reason));

  const headers = {};
  let body;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (formData) {
    body = formData; // sem Content-Type: o navegador define o boundary
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method, headers, body,
      credentials: "include",
      signal: controller.signal,
    });
  } catch (cause) {
    if (controller.signal.aborted && controller.signal.reason === "timeout") {
      throw new ApiError("O servidor demorou para responder. Tente novamente.", { code: "TIMEOUT", cause });
    }
    if (signal?.aborted) throw cause; // cancelamento intencional: não é erro de UI
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      { code: "NETWORK", cause }
    );
  } finally {
    clearTimeout(timer);
  }

  const data = await lerCorpo(response);

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) onUnauthorized?.();

    const message =
      mensagemDoServidor(data) ||
      messages[response.status] ||
      MENSAGENS_PADRAO[response.status] ||
      (response.status >= 500 ? MENSAGENS_PADRAO[500] : "Não foi possível concluir a operação.");

    throw new ApiError(message, {
      status: response.status,
      code: "HTTP",
      fieldErrors: extrairErrosDeCampo(data),
    });
  }

  return data;
}

export const api = {
  get:    (path, opts)       => request(path, { ...opts, method: "GET" }),
  post:   (path, json, opts) => request(path, { ...opts, method: "POST", json }),
  put:    (path, json, opts) => request(path, { ...opts, method: "PUT", json }),
  delete: (path, opts)       => request(path, { ...opts, method: "DELETE" }),
  postForm: (path, formData, opts) => request(path, { ...opts, method: "POST", formData }),
  putForm:  (path, formData, opts) => request(path, { ...opts, method: "PUT", formData }),
};