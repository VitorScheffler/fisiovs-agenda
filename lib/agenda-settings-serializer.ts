import { ClinicSettings as PrismaClinicSettings } from "@prisma/client";
import { AgendaConfig } from "@/lib/types";
import { parseDiasAtendimento } from "@/lib/schedule-utils";

export function serializeAgendaConfig(settings: PrismaClinicSettings): AgendaConfig {
  return {
    horarioInicio: settings.horarioInicio,
    horarioFim: settings.horarioFim,
    duracaoConsulta: settings.duracaoConsulta,
    intervaloConsulta: settings.intervaloConsulta,
    diasAtendimento: parseDiasAtendimento(settings.diasAtendimento),
  };
}
