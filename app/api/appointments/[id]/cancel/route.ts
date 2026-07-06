import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializeAppointment } from "@/lib/appointment-serializer";

type Params = { params: Promise<{ id: string }> };

const cancelSchema = z.object({
  reason: z.string().trim().min(1, "Informe o motivo do cancelamento."),
});

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Agendamento não encontrado.", 404);
  }
  if (existing.status === "cancelado") {
    return jsonError("Este agendamento já está cancelado.", 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  // Marca como cancelado (em vez de apagar) para preservar o histórico,
  // e libera o horário para novos agendamentos.
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: "cancelado", cancelReason: parsed.data.reason },
  });

  return jsonOk({ appointment: serializeAppointment(appointment) });
}
