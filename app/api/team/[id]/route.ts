import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk } from "@/lib/api-utils";
import { serializeTeamMember } from "@/lib/team-serializer";

const TEAM_MANAGE_ROLES = ["admin", "fisioterapeuta"];

const teamMemberUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["Fisioterapeuta", "Secretaria", "Auxiliar", "TI"]).optional(),
  specialty: z.string().nullable().optional(),
  crefito: z.string().nullable().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  status: z.enum(["ativo", "inativo", "ferias"]).optional(),
  since: z.string().min(1).optional(),
  initials: z.string().min(1).max(3).optional(),
  color: z.string().min(1).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(TEAM_MANAGE_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = teamMemberUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Membro da equipe não encontrado.", 404);
  }

  const data = parsed.data;

  if (data.email) {
    const conflict = await prisma.teamMember.findUnique({ where: { email: data.email } });
    if (conflict && conflict.id !== id) {
      return jsonError("Já existe um membro da equipe com este e-mail.", 409);
    }
  }

  const member = await prisma.teamMember.update({
    where: { id },
    data,
  });

  return jsonOk({ member: serializeTeamMember(member) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireRole(TEAM_MANAGE_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Membro da equipe não encontrado.", 404);
  }

  await prisma.teamMember.delete({ where: { id } });

  return jsonOk({ success: true });
}
