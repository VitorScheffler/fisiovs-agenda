import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializeAppointment } from "@/lib/appointment-serializer";

const appointmentUpdateSchema = z.object({
  day: z.number().int().min(0).max(5).optional(),
  time: z.string().min(1).optional(),
  durationSlots: z.number().int().min(1).max(4).optional(),
  patientId: z.string().nullable().optional(),
  patientName: z.string().min(1).optional(),
  category: z.enum(["avaliacao", "retorno", "tratamento", "pilates", "bloqueado"]).optional(),
  note: z.string().nullable().optional(),
  status: z.enum(["confirmado", "pendente"]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = appointmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Agendamento não encontrado.", 404);
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: parsed.data,
  });

  return jsonOk({ appointment: serializeAppointment(appointment) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Agendamento não encontrado.", 404);
  }

  await prisma.appointment.delete({ where: { id } });

  return jsonOk({ success: true });
}
