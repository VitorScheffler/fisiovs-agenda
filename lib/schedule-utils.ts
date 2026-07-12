import { AgendaConfig } from "./types";

// Dias da semana padrão (0=Dom..6=Sáb): Segunda a Sábado, igual ao comportamento antigo fixo.
export const DEFAULT_ATTEND_DAYS = [1, 2, 3, 4, 5, 6];

/** Configuração padrão usada como fallback enquanto a config real (do banco) ainda não carregou. */
export const DEFAULT_AGENDA_CONFIG: AgendaConfig = {
  horarioInicio: "08:00",
  horarioFim: "18:00",
  duracaoConsulta: 60,
  intervaloConsulta: 15,
  diasAtendimento: DEFAULT_ATTEND_DAYS,
};

/** Converte "1,2,3,4,5,6" em [1,2,3,4,5,6], validando e removendo duplicados/valores inválidos. */
export function parseDiasAtendimento(raw: string): number[] {
  const days = raw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n >= 0 && n <= 6);
  const unique = Array.from(new Set(days)).sort((a, b) => a - b);
  return unique.length > 0 ? unique : DEFAULT_ATTEND_DAYS;
}

/** Converte [1,2,3,4,5,6] em "1,2,3,4,5,6" para persistir no banco. */
export function stringifyDiasAtendimento(days: number[]): string {
  const unique = Array.from(new Set(days)).filter((n) => n >= 0 && n <= 6).sort((a, b) => a - b);
  return (unique.length > 0 ? unique : DEFAULT_ATTEND_DAYS).join(",");
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = String(Math.floor(minutes / 60) % 24).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Gera a lista de horários (HH:mm) usados como linhas/opções da agenda,
 * em passos do intervalo configurado (ex: 15 minutos → 08:00, 08:15, 08:30...),
 * começando exatamente no horário de início configurado até (exclusive) o
 * horário de fim. "00:00" como fim representa meia-noite (ou seja, o
 * atendimento vai até o fim do dia).
 */
export function generateAgendaHours(
  config: Pick<AgendaConfig, "horarioInicio" | "horarioFim" | "intervaloConsulta">
): string[] {
  const startMinutes = timeToMinutes(config.horarioInicio);
  let endMinutes = timeToMinutes(config.horarioFim);
  if (endMinutes <= startMinutes) endMinutes += 24 * 60; // cobre "00:00" (meia-noite) e virada de dia

  // Passo em minutos entre cada horário selecionável. Cai para 60min se o
  // intervalo configurado for 0 ou inválido, evitando loop infinito/vazio.
  const step = config.intervaloConsulta > 0 ? config.intervaloConsulta : 60;

  const result: string[] = [];
  for (let m = startMinutes; m < endMinutes; m += step) {
    result.push(minutesToTime(m % (24 * 60)));
  }
  return result.length > 0 ? result : [config.horarioInicio];
}