export type AppointmentCategory =
  | "avaliacao"
  | "retorno"
  | "tratamento"
  | "pilates"
  | "bloqueado";

export type AppointmentStatus = "confirmado" | "pendente";

export type Appointment = {
  id: string;
  day: number; // 0 = Segunda ... 5 = Sábado
  time: string; // "08:00"
  durationSlots: number; // quantidade de slots de 1h
  patient: string;
  category: AppointmentCategory;
  note?: string;
  status?: AppointmentStatus;
};

export const categoryLabels: Record<AppointmentCategory, string> = {
  avaliacao: "Avaliação",
  retorno: "Retorno",
  tratamento: "Tratamento",
  pilates: "Pilates",
  bloqueado: "Bloqueado",
};
