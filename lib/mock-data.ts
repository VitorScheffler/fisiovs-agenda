// Constantes de UI da agenda semanal. Os dados reais de agendamentos,
// pacientes e equipe agora vêm das APIs (/api/appointments, /api/patients,
// /api/team) consumidas via AppContext.

import { getCurrentMonthCalendarDays } from "./date-utils";

export const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const hours = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

/** Dias do mês corrente, com label do dia da semana (SEG..DOM) */
export const calendarDays: { label: string; date: number }[] = getCurrentMonthCalendarDays();

export const availableSlots: { time: string; available: boolean }[] = [
  { time: "08:00", available: true },
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: false },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
];