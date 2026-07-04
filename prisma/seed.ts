import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

function startOfWeek(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dow = now.getDay();
  const diff = dow === 0 ? 6 : dow - 1;
  now.setDate(now.getDate() - diff);
  return now;
}
function weekday(offset: number): Date {
  const d = new Date(startOfWeek());
  d.setDate(d.getDate() + offset);
  return d;
}

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.appointment.deleteMany();
  await prisma.appointmentHistoryEntry.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();

  console.log("Criando pacientes...");
  const camila = await prisma.patient.create({
    data: {
      name: "Camila Souza",
      email: "camila@email.com",
      phone: "(51) 99123-4567",
      birthDate: new Date("1993-07-14"),
      cpf: "012.345.678-90",
      address: "Rua das Flores, 142 — Novo Hamburgo/RS",
      status: "ativo",
      condition: "Dor lombar crônica — pós-cirurgia L4/L5",
      since: "Mar 2025",
      notes:
        "Paciente com boa adesão ao tratamento. Relata melhora de 60% na dor após 8 sessões.",
      appointmentHistory: {
        create: [
          { date: "05/03/2025", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
          { date: "12/03/2025", category: "tratamento", note: "Cinesioterapia lombar", status: "confirmado" },
          { date: "19/03/2025", category: "tratamento", note: "Cinesioterapia + TENS", status: "confirmado" },
          { date: "26/03/2025", category: "pilates", note: "Pilates clínico", status: "confirmado" },
          { date: "02/04/2025", category: "retorno", note: "Reavaliação 30 dias", status: "confirmado" },
          { date: "09/04/2025", category: "tratamento", note: "Cinesioterapia lombar", status: "confirmado" },
          { date: "10/06/2026", category: "tratamento", note: "Remarcar para sexta às 14h", status: "pendente" },
        ],
      },
    },
  });

  const joao = await prisma.patient.create({
    data: {
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(51) 98765-4321",
      birthDate: new Date("1985-03-22"),
      cpf: "123.456.789-00",
      address: "Av. Brasil, 500 — São Leopoldo/RS",
      status: "ativo",
      condition: "Tendinopatia do manguito rotador direito",
      since: "Jun 2026",
      notes: "Iniciou avaliação recentemente. Atleta amador de futebol.",
      appointmentHistory: {
        create: [
          { date: "09/06/2026", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
        ],
      },
    },
  });

  const anaPaula = await prisma.patient.create({
    data: {
      name: "Ana Paula",
      email: "ana.paula@email.com",
      phone: "(51) 99456-7890",
      birthDate: new Date("1978-11-05"),
      cpf: "234.567.890-11",
      status: "ativo",
      condition: "Reabilitação pós-operatória — joelho esquerdo (LCA)",
      since: "Jan 2026",
      appointmentHistory: {
        create: [
          { date: "08/01/2026", category: "avaliacao", note: "Avaliação pós-op 30 dias", status: "confirmado" },
          { date: "15/01/2026", category: "tratamento", note: "Fortalecimento quadríceps", status: "confirmado" },
          { date: "22/01/2026", category: "tratamento", note: "Propriocepção + fortalecimento", status: "confirmado" },
          { date: "10/06/2026", category: "tratamento", note: "Pós-operatória", status: "confirmado" },
        ],
      },
    },
  });

  const mariana = await prisma.patient.create({
    data: {
      name: "Mariana Lima",
      email: "mariana.lima@email.com",
      phone: "(51) 99321-0987",
      birthDate: new Date("1990-09-18"),
      cpf: "345.678.901-22",
      status: "ativo",
      condition: "Cervicalgia + cefaleia tensional",
      since: "Abr 2026",
      appointmentHistory: {
        create: [
          { date: "03/04/2026", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
          { date: "10/04/2026", category: "tratamento", note: "Mobilização cervical + RPG", status: "confirmado" },
          { date: "11/06/2026", category: "retorno", note: "Ortopédica", status: "confirmado" },
        ],
      },
    },
  });

  const lucas = await prisma.patient.create({
    data: {
      name: "Lucas Ferreira",
      email: "lucas.ferreira@email.com",
      phone: "(51) 98654-3210",
      birthDate: new Date("2000-01-30"),
      cpf: "456.789.012-33",
      status: "ativo",
      condition: "Escoliose funcional + postura anteriorizada",
      since: "Mai 2026",
      appointmentHistory: {
        create: [
          { date: "05/05/2026", category: "avaliacao", note: "Avaliação postural", status: "confirmado" },
          { date: "12/05/2026", category: "pilates", note: "Pilates clínico — início", status: "confirmado" },
          { date: "11/06/2026", category: "pilates", note: "Reabilitação funcional", status: "confirmado" },
        ],
      },
    },
  });

  const beatriz = await prisma.patient.create({
    data: {
      name: "Beatriz Souza",
      email: "beatriz.souza@email.com",
      phone: "(51) 99789-6543",
      birthDate: new Date("1968-04-12"),
      cpf: "567.890.123-44",
      status: "ativo",
      condition: "Lombalgia crônica — hérnia L3/L4",
      since: "Fev 2026",
      appointmentHistory: {
        create: [
          { date: "10/02/2026", category: "avaliacao", note: "Avaliação inicial", status: "confirmado" },
          { date: "17/02/2026", category: "tratamento", note: "TENS + cinesioterapia", status: "confirmado" },
          { date: "12/06/2026", category: "retorno", note: "Dores na coluna", status: "confirmado" },
        ],
      },
    },
  });

  console.log("Criando usuários e membros da equipe...");

  const vitoriaTeam = await prisma.teamMember.create({
    data: {
      name: "Vitoria Raiane Scheffler",
      role: "Fisioterapeuta",
      specialty: "Ortopédica e Esportiva",
      crefito: "CREFITO-5 / 123456-F",
      email: "vitoria@fisiovs.com",
      phone: "(51) 99100-0001",
      status: "ativo",
      since: "Jun 2026",
      initials: "VS",
      color: "bg-[var(--color-pine-100)] text-[var(--color-pine-700)]",
    },
  });

  await prisma.user.create({
    data: {
      name: "Vitoria Raiane Scheffler",
      email: "vitoria@fisiovs.com",
      password: await hash("admin123"),
      role: "admin",
      specialty: "Fisioterapia Ortopédica e Esportiva",
      crefito: "CREFITO-5 / 123456-F",
      teamMember: { connect: { id: vitoriaTeam.id } },
    },
  });

  const vitorTeam = await prisma.teamMember.create({
    data: {
      name: "Vitor Scheffler",
      role: "TI",
      email: "vitor@fisiovs.com",
      phone: "(51) 99100-0004",
      status: "ativo",
      since: "Jun 2026",
      initials: "VS",
      color: "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]",
    },
  });

  const rafaelTeam = await prisma.teamMember.create({
    data: {
      name: "Rafael Costa",
      role: "Fisioterapeuta",
      specialty: "Fisioterapia Neurológica",
      crefito: "CREFITO-5 / 234567-F",
      email: "rafael@fisiovs.com",
      phone: "(51) 99100-0002",
      status: "ativo",
      since: "Jun 2026",
      initials: "RC",
      color: "bg-[var(--color-pine-100)] text-[var(--color-pine-700)]",
    },
  });

  await prisma.user.create({
    data: {
      name: "Rafael Costa",
      email: "rafael@fisiovs.com",
      password: await hash("fisio123"),
      role: "fisioterapeuta",
      specialty: "Fisioterapia Neurológica",
      crefito: "CREFITO-5 / 234567-F",
      teamMember: { connect: { id: rafaelTeam.id } },
    },
  });

  const larissaTeam = await prisma.teamMember.create({
    data: {
      name: "Larissa Nunes",
      role: "Secretaria",
      email: "larissa@fisiovs.com",
      phone: "(51) 99100-0003",
      status: "ativo",
      since: "Jun 2026",
      initials: "LN",
      color: "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]",
    },
  });

  await prisma.user.create({
    data: {
      name: "Larissa Nunes",
      email: "larissa@fisiovs.com",
      password: await hash("sec123"),
      role: "secretaria",
      teamMember: { connect: { id: larissaTeam.id } },
    },
  });

  // Conecta o membro de TI a um usuário admin extra (opcional, sem login dedicado por ora)
  await prisma.teamMember.update({
    where: { id: vitorTeam.id },
    data: {},
  });

  // Usuário paciente vinculado à Camila
  await prisma.user.create({
    data: {
      name: "Camila Souza",
      email: "camila@email.com",
      password: await hash("paciente123"),
      role: "paciente",
      patientId: camila.id,
    },
  });

  console.log("Criando agendamentos da semana...");
  await prisma.appointment.createMany({
    data: [
      { date: weekday(0), time: "08:00", durationSlots: 1, patientId: joao.id, patientName: "João Silva", category: "avaliacao", status: "confirmado" },
      { date: weekday(0), time: "10:00", durationSlots: 1, patientId: anaPaula.id, patientName: "Ana Paula", category: "tratamento", note: "Pós-operatória", status: "confirmado" },
      { date: weekday(0), time: "14:00", durationSlots: 1, patientName: "Fernanda Costa", category: "tratamento", note: "Neurológica", status: "confirmado" },
      { date: weekday(0), time: "17:00", durationSlots: 1, patientName: "Gabriel Ribeiro", category: "retorno", note: "Alongamento", status: "confirmado" },

      { date: weekday(2), time: "09:00", durationSlots: 1, patientId: mariana.id, patientName: "Mariana Lima", category: "retorno", note: "Ortopédica", status: "confirmado" },
      { date: weekday(2), time: "11:00", durationSlots: 1, patientId: lucas.id, patientName: "Lucas Ferreira", category: "pilates", note: "Reabilitação funcional", status: "confirmado" },
      { date: weekday(2), time: "15:00", durationSlots: 1, patientName: "Ricardo Mendes", category: "tratamento", note: "Desportiva", status: "confirmado" },

      { date: weekday(3), time: "08:00", durationSlots: 1, patientName: "Carlos Oliveira", category: "avaliacao", note: "Respiratória", status: "confirmado" },
      { date: weekday(3), time: "11:00", durationSlots: 1, patientId: beatriz.id, patientName: "Beatriz Souza", category: "retorno", note: "Dores na coluna", status: "confirmado" },

      { date: weekday(4), time: "14:00", durationSlots: 1, patientName: "Juliana Alves", category: "pilates", note: "Terapêutico", status: "confirmado" },

      { date: weekday(5), time: "14:00", durationSlots: 1, patientId: camila.id, patientName: "Maria Silva", category: "avaliacao", note: "Novo agendamento solicitado", status: "pendente" },
    ],
  });

  console.log("Seed concluído com sucesso!");
  console.log("");
  console.log("Usuários de teste:");
  console.log("  Admin/Fisioterapeuta: vitoria@fisiovs.com / admin123");
  console.log("  Fisioterapeuta:       rafael@fisiovs.com / fisio123");
  console.log("  Secretária:           larissa@fisiovs.com / sec123");
  console.log("  Paciente:             camila@email.com / paciente123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
