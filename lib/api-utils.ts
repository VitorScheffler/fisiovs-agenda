import { NextResponse } from "next/server";
import { getSession, SessionPayload } from "./auth";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Garante que existe uma sessão válida. Retorna a sessão ou uma
 * resposta de erro 401 já pronta para ser retornada pelo handler.
 */
export async function requireSession(): Promise<
  { session: SessionPayload } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { error: jsonError("Não autenticado.", 401) };
  }
  return { session };
}

/**
 * Garante que a sessão pertence a um dos papéis permitidos.
 */
export async function requireRole(
  roles: string[]
): Promise<{ session: SessionPayload } | { error: NextResponse }> {
  const result = await requireSession();
  if ("error" in result) return result;

  if (!roles.includes(result.session.role)) {
    return { error: jsonError("Acesso não autorizado para este recurso.", 403) };
  }
  return result;
}

export const STAFF_ROLES = ["admin", "fisioterapeuta", "secretaria"];
