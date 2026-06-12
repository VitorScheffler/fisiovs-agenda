import { Patient } from "./types";

export const PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Camila Souza",
    email: "camila@email.com",
    phone: "(51) 99123-4567",
    birthDate: "1993-07-14",
    cpf: "012.345.678-90",
    address: "Rua das Flores, 142 — Novo Hamburgo/RS",
    status: "ativo",
    condition: "Dor lombar crônica — pós-cirurgia L4/L5",
    since: "Mar 2025",
    notes: "Paciente com boa adesão ao tratamento. Relata melhora de 60% na dor após 8 sessões.",
    appointmentHistory: [
      { date: "05/03/2025", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
      { date: "12/03/2025", category: "tratamento", note: "Cinesioterapia lombar", status: "confirmado" },
      { date: "19/03/2025", category: "tratamento", note: "Cinesioterapia + TENS", status: "confirmado" },
      { date: "26/03/2025", category: "tratamento", note: "Pilates clínico", status: "confirmado" },
      { date: "02/04/2025", category: "retorno", note: "Reavaliação 30 dias", status: "confirmado" },
      { date: "09/04/2025", category: "tratamento", note: "Cinesioterapia lombar", status: "confirmado" },
      { date: "10/06/2026", category: "tratamento", note: "Remarcar para sexta às 14h", status: "pendente" },
    ],
  },
  {
    id: "p2",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(51) 98765-4321",
    birthDate: "1985-03-22",
    cpf: "123.456.789-00",
    address: "Av. Brasil, 500 — São Leopoldo/RS",
    status: "ativo",
    condition: "Tendinopatia do manguito rotador direito",
    since: "Jun 2026",
    notes: "Iniciou avaliação recentemente. Atleta amador de futebol.",
    appointmentHistory: [
      { date: "09/06/2026", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
    ],
  },
  {
    id: "p3",
    name: "Ana Paula",
    email: "ana.paula@email.com",
    phone: "(51) 99456-7890",
    birthDate: "1978-11-05",
    cpf: "234.567.890-11",
    status: "ativo",
    condition: "Reabilitação pós-operatória — joelho esquerdo (LCA)",
    since: "Jan 2026",
    appointmentHistory: [
      { date: "08/01/2026", category: "avaliacao", note: "Avaliação pós-op 30 dias", status: "confirmado" },
      { date: "15/01/2026", category: "tratamento", note: "Fortalecimento quadríceps", status: "confirmado" },
      { date: "22/01/2026", category: "tratamento", note: "Propriocepção + fortalecimento", status: "confirmado" },
      { date: "10/06/2026", category: "tratamento", note: "Pós-operatória", status: "confirmado" },
    ],
  },
  {
    id: "p4",
    name: "Mariana Lima",
    email: "mariana.lima@email.com",
    phone: "(51) 99321-0987",
    birthDate: "1990-09-18",
    cpf: "345.678.901-22",
    status: "ativo",
    condition: "Cervicalgia + cefaleia tensional",
    since: "Abr 2026",
    appointmentHistory: [
      { date: "03/04/2026", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
      { date: "10/04/2026", category: "tratamento", note: "Mobilização cervical + RPG", status: "confirmado" },
      { date: "11/06/2026", category: "retorno", note: "Ortopédica", status: "confirmado" },
    ],
  },
  {
    id: "p5",
    name: "Lucas Ferreira",
    email: "lucas.ferreira@email.com",
    phone: "(51) 98654-3210",
    birthDate: "2000-01-30",
    cpf: "456.789.012-33",
    status: "ativo",
    condition: "Escoliose funcional + postura anteriorizada",
    since: "Mai 2026",
    appointmentHistory: [
      { date: "05/05/2026", category: "avaliacao", note: "Avaliação postural", status: "confirmado" },
      { date: "12/05/2026", category: "pilates", note: "Pilates clínico — início", status: "confirmado" },
      { date: "11/06/2026", category: "pilates", note: "Reabilitação funcional", status: "confirmado" },
    ],
  },
  {
    id: "p6",
    name: "Beatriz Souza",
    email: "beatriz.souza@email.com",
    phone: "(51) 99789-6543",
    birthDate: "1968-04-12",
    cpf: "567.890.123-44",
    status: "ativo",
    condition: "Lombalgia crônica — hérnia L3/L4",
    since: "Fev 2026",
    appointmentHistory: [
      { date: "10/02/2026", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
      { date: "17/02/2026", category: "tratamento", note: "TENS + cinesioterapia", status: "confirmado" },
      { date: "12/06/2026", category: "retorno", note: "Dores na coluna", status: "confirmado" },
    ],
  },
];

export function getPatientById(id: string): Patient | undefined {
  return PATIENTS.find((p) => p.id === id);
}

export function calcAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}