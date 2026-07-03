import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk } from "@/lib/api-utils";
import { serializeTeamMember } from "@/lib/team-serializer";

// Apenas fisioterapeuta/admin podem gerenciar a equipe.
const TEAM_MANAGE_ROLES = ["admin", "fisioterapeuta"];

const teamMemberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  role: z.enum(["Fisioterapeuta", "Secretaria", "Auxiliar", "TI"]),
  specialty: z.string().optional(),
  crefito: z.string().optional(),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(1, "Telefone é obrigatório."),
  status: z.enum(["ativo", "inativo", "ferias"]).optional(),
  since: z.string().min(1, "Campo 'since' é obrigatório."),
  initials: z.string().min(1).max(3),
  color: z.string().min(1),
});

export async function GET() {
  const auth = await requireRole(TEAM_MANAGE_ROLES);
  if ("error" in auth) return auth.error;

  const members = await prisma.teamMember.findMany({ orderBy: { name: "asc" } });
  return jsonOk({ team: members.map(serializeTeamMember) });
}

export async function POST(request: Request) {
  const auth = await requireRole(TEAM_MANAGE_ROLES);
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const data = parsed.data;

  const existing = await prisma.teamMember.findUnique({ where: { email: data.email } });
  if (existing) {
    return jsonError("Já existe um membro da equipe com este e-mail.", 409);
  }

  const member = await prisma.teamMember.create({
    data: {
      name: data.name,
      role: data.role,
      specialty: data.specialty,
      crefito: data.crefito,
      email: data.email,
      phone: data.phone,
      status: data.status ?? "ativo",
      since: data.since,
      initials: data.initials,
      color: data.color,
    },
  });

  return jsonOk({ member: serializeTeamMember(member) }, 201);
}
