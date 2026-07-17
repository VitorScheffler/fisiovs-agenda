import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  await prisma.clinicSettings.deleteMany();

    console.log("Criando usuários...");

  // Vitor
  const vitorTeam = await prisma.teamMember.create({
    data: {
      name: "Vitor Scheffler",
      role: "TI",
      email: "vitor.scheffler@hotmail.com",
      phone: "",
      status: "ativo",
      since: "Jul 2026",
      initials: "VS",
      color: "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]",
    },
  });

  await prisma.user.create({
    data: {
      name: "Vitor Scheffler",
      email: "vitor.scheffler@hotmail.com",
      password: await hash("Vitor123@"),
      role: "admin",
      teamMember: {
        connect: {
          id: vitorTeam.id,
        },
      },
    },
  });

  console.log("Seed concluído com sucesso!");
  console.log("");
  console.log("Usuários de login:");
  console.log("  Admin: vitor.scheffler@hotmail.com / Vitor123@");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });