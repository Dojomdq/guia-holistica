// Leer el body de una request como JSON con límite de tamaño.
// Devuelve { ok: true, body } o { ok: false, status, error }.
export async function readJsonBody(request: Request, maxBytes = 512 * 1024) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return { ok: false as const, status: 400, error: "Content-Type debe ser application/json" };
  }

  try {
    const text = await request.text();
    if (text.length > maxBytes) {
      return { ok: false as const, status: 413, error: "Payload demasiado grande" };
    }
    const body = JSON.parse(text);
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return { ok: false as const, status: 400, error: "Cuerpo inválido" };
    }
    return { ok: true as const, body: body as Record<string, unknown> };
  } catch {
    return { ok: false as const, status: 400, error: "JSON inválido o cuerpo malformado" };
  }
}
