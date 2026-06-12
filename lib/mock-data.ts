import { Appointment } from "./types";

export const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const weekDates = ["09/06", "10/06", "11/06", "12/06", "13/06", "14/06"];

export const hours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const calendarDays = [
  { label: "SEG", date: 8 },
  { label: "TER", date: 9 },
  { label: "QUA", date: 10 },
  { label: "QUI", date: 11 },
  { label: "SEX", date: 12 },
  { label: "SÁB", date: 13 },
  { label: "DOM", date: 14 },
];

export const availableSlots: { time: string; available: boolean }[] = [
  { time: "08:00", available: true },
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: false },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
];

export const appointments: Appointment[] = [
  { id: "1", day: 0, time: "08:00", durationSlots: 1, patient: "João Silva", category: "avaliacao" },
  { id: "2", day: 0, time: "10:00", durationSlots: 1, patient: "Ana Paula", category: "tratamento", note: "Pós-operatória" },
  { id: "3", day: 0, time: "14:00", durationSlots: 1, patient: "Fernanda Costa", category: "tratamento", note: "Neurológica" },
  { id: "4", day: 0, time: "17:00", durationSlots: 1, patient: "Gabriel Ribeiro", category: "retorno", note: "Alongamento" },

  { id: "5", day: 2, time: "09:00", durationSlots: 1, patient: "Mariana Lima", category: "retorno", note: "Ortopédica" },
  { id: "6", day: 2, time: "11:00", durationSlots: 1, patient: "Lucas Ferreira", category: "pilates", note: "Reabilitação funcional" },
  { id: "7", day: 2, time: "15:00", durationSlots: 1, patient: "Ricardo Mendes", category: "tratamento", note: "Desportiva" },

  { id: "8", day: 3, time: "08:00", durationSlots: 1, patient: "Carlos Oliveira", category: "avaliacao", note: "Respiratória" },
  { id: "9", day: 3, time: "11:00", durationSlots: 1, patient: "Beatriz Souza", category: "retorno", note: "Dores na coluna" },


  { id: "11", day: 4, time: "14:00", durationSlots: 1, patient: "Juliana Alves", category: "pilates", note: "Terapêutico" },
];
