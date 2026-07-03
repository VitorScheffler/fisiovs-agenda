import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-utils";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
  role: z.enum(["admin", "fisioterapeuta", "secretaria"]).optional().default("secretaria"),
  specialty: z.string().optional(),
  crefito: z.string().optional(),
  // Código de convite obrigatório para registros não-paciente
  inviteCode: z.string().optional(),
});

// Código de convite simples para controlar quem pode se cadastrar como staff
// Em produção, substituir por sistema de convites por e-mail
const STAFF_INVITE_CODE = process.env.STAFF_INVITE_CODE ?? "FisioVS2026";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const { name, email, password, role, specialty, crefito, inviteCode } = parsed.data;

  // Valida código de convite para cadastro de staff
  if (inviteCode !== STAFF_INVITE_CODE) {
    return jsonError("Código de convite inválido.", 403);
  }

  // Verifica se e-mail já existe
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return jsonError("Já existe uma conta com este e-mail.", 409);
  }

  const hashed = await hashPassword(password);

  // Gera iniciais e cor para o membro da equipe
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  const colors = [
    "bg-[var(--color-pine-100)] text-[var(--color-pine-700)]",
    "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const now = new Date();
  const since = now.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });

  // Cria membro da equipe + usuário em transação
  const user = await prisma.$transaction(async (tx) => {
    const teamMember = await tx.teamMember.create({
      data: {
        name,
        role: role === "admin" ? "Fisioterapeuta" : role === "fisioterapeuta" ? "Fisioterapeuta" : "Secretaria",
        specialty: specialty || undefined,
        crefito: crefito || undefined,
        email,
        phone: "",
        status: "ativo",
        since,
        initials,
        color,
      },
    });

    return tx.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        specialty: specialty || undefined,
        crefito: crefito || undefined,
        teamMember: { connect: { id: teamMember.id } },
      },
    });
  });

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return jsonOk(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
        crefito: user.crefito,
        avatar: user.avatar,
        patientId: user.patientId,
      },
    },
    201
  );
}