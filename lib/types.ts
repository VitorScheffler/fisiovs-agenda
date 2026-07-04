export type AppointmentCategory =
  | "avaliacao"
  | "retorno"
  | "tratamento"
  | "pilates"
  | "bloqueado";

export type AppointmentStatus = "confirmado" | "pendente" | "rejeitado";

export type Appointment = {
  id: string;
  day: number; // 0 = Segunda ... 5 = Sábado
  time: string; // "08:00"
  durationSlots: number; // quantidade de slots de 1h
  patient: string; // nome do paciente (snapshot)
  patientId?: string | null;
  category: AppointmentCategory;
  note?: string | null;
  status?: AppointmentStatus;
};

export const categoryLabels: Record<AppointmentCategory, string> = {
  avaliacao: "Avaliação",
  retorno: "Retorno",
  tratamento: "Tratamento",
  pilates: "Pilates",
  bloqueado: "Bloqueado",
};

export type PatientStatus = "ativo" | "inativo" | "alta";

export type PaymentMethod = "dinheiro" | "pix" | "cartao" | "convenio" | "isento";

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  cartao: "Cartão",
  convenio: "Convênio",
  isento: "Isento",
};

export type AppointmentHistoryEntry = {
  id: string;
  appointmentId?: string | null;
  date: string;
  time?: string | null;
  category: AppointmentCategory;
  complaint?: string | null;
  procedure?: string | null;
  note?: string | null;
  attended: boolean;
  paymentMethod?: PaymentMethod | null;
  paid: boolean;
  receiptUrl?: string | null;
  status?: AppointmentStatus;
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // ISO yyyy-MM-dd
  cpf: string;
  address?: string | null;
  status: PatientStatus;
  condition?: string | null;
  since: string;
  notes?: string | null;
  appointmentHistory: AppointmentHistoryEntry[];
};

export type TeamRole = "Fisioterapeuta" | "Secretaria" | "Auxiliar" | "TI";
export type TeamStatus = "ativo" | "inativo" | "ferias";

export type TeamMember = {
  id: string;
  userId?: string | null;
  name: string;
  role: TeamRole;
  specialty?: string | null;
  crefito?: string | null;
  email: string;
  phone: string;
  status: TeamStatus;
  since: string;
  initials: string;
  color: string;
};

export type UserRole = "admin" | "fisioterapeuta" | "secretaria" | "paciente";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialty?: string | null;
  crefito?: string | null;
  avatar?: string | null;
  patientId?: string | null;
};

