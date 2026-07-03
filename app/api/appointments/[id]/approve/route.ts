import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializeAppointment } from "@/lib/appointment-serializer";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Agendamento não encontrado.", 404);
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: "confirmado" },
  });

  return jsonOk({ appointment: serializeAppointment(appointment) });
}
