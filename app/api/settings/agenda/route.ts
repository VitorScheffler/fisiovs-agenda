import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializeAgendaConfig } from "@/lib/agenda-settings-serializer";
import { stringifyDiasAtendimento } from "@/lib/schedule-utils";

const SETTINGS_ID = "singleton";

// "HH:mm", incluindo "00:00" como horário válido (meia-noite / fim do dia).
const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido. Use o formato HH:mm.");

const agendaConfigSchema = z
  .object({
    horarioInicio: timeSchema,
    horarioFim: timeSchema,
    duracaoConsulta: z.number().int().min(5).max(480),
    intervaloConsulta: z.number().int().min(0).max(240),
    diasAtendimento: z
      .array(z.number().int().min(0).max(6))
      .min(1, "Selecione pelo menos um dia de atendimento."),
  })
  .refine(
    (data) => !(data.horarioInicio === data.horarioFim && data.horarioFim !== "00:00"),
    {
      message: "O horário de início e fim não podem ser iguais.",
      path: ["horarioFim"],
    }
  );

async function getOrCreateSettings() {
  return prisma.clinicSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export async function GET() {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const settings = await getOrCreateSettings();
  return jsonOk({ agendaConfig: serializeAgendaConfig(settings) });
}

export async function PUT(request: Request) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = agendaConfigSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const data = parsed.data;

  const settings = await prisma.clinicSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      duracaoConsulta: data.duracaoConsulta,
      intervaloConsulta: data.intervaloConsulta,
      diasAtendimento: stringifyDiasAtendimento(data.diasAtendimento),
    },
    create: {
      id: SETTINGS_ID,
      horarioInicio: data.horarioInicio,
      horarioFim: data.horarioFim,
      duracaoConsulta: data.duracaoConsulta,
      intervaloConsulta: data.intervaloConsulta,
      diasAtendimento: stringifyDiasAtendimento(data.diasAtendimento),
    },
  });

  return jsonOk({ agendaConfig: serializeAgendaConfig(settings) });
}
