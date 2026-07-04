import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializeAppointment } from "@/lib/appointment-serializer";

const appointmentSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
  time: z.string().min(1),
  durationSlots: z.number().int().min(1).max(4).optional(),
  patientId: z.string().optional(),
  patientName: z.string().min(1, "Nome do paciente é obrigatório."),
  category: z.enum(["avaliacao", "retorno", "tratamento", "pilates", "bloqueado"]),
  note: z.string().nullable().optional(),
  status: z.enum(["confirmado", "pendente"]).optional(),
});

export async function GET() {
  const auth = await requireSession();
  if ("error" in auth) return auth.error;

  const where =
    auth.session.role === "paciente"
      ? {
          status: { not: "rejeitado" as const },
          patient: {
            user: { id: auth.session.userId },
          },
        }
      : { status: { not: "rejeitado" as const } };

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return jsonOk({ appointments: appointments.map(serializeAppointment) });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const data = parsed.data;

  if (auth.session.role === "paciente") {
    const me = await prisma.user.findUnique({ where: { id: auth.session.userId } });
    if (!me?.patientId || data.patientId !== me.patientId) {
      return jsonError("Pacientes só podem agendar para si mesmos.", 403);
    }
    if (data.status && data.status !== "pendente") {
      return jsonError("Pacientes só podem criar solicitações pendentes.", 403);
    }
    data.status = "pendente";
  } else if (!STAFF_ROLES.includes(auth.session.role)) {
    return jsonError("Acesso não autorizado para este recurso.", 403);
  }

  if (data.patientId) {
    const patient = await prisma.patient.findUnique({ where: { id: data.patientId } });
    if (!patient) {
      return jsonError("Paciente informado não foi encontrado.", 404);
    }
  }

  const appointmentDate = new Date(data.date);

  const sameDayAppointments = await prisma.appointment.findMany({
    where: { date: appointmentDate, status: { not: "rejeitado" } },
  });

  const hours = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
  ];
  const newStart = hours.indexOf(data.time);
  const newDuration = data.durationSlots ?? 1;

  if (newStart === -1) {
    return jsonError("Horário inválido.", 400);
  }

  const hasConflict = sameDayAppointments.some((a) => {
    const existingStart = hours.indexOf(a.time);
    const existingEnd = existingStart + a.durationSlots;
    const newEnd = newStart + newDuration;
    return newStart < existingEnd && existingStart < newEnd;
  });

  if (hasConflict) {
    return jsonError("Já existe um agendamento neste horário.", 409);
  }

  const appointment = await prisma.appointment.create({
    data: {
      date: appointmentDate,
      time: data.time,
      durationSlots: newDuration,
      patientId: data.patientId,
      patientName: data.patientName,
      category: data.category,
      note: data.note,
      status: data.status ?? "confirmado",
    },
  });

  return jsonOk({ appointment: serializeAppointment(appointment) }, 201);
}