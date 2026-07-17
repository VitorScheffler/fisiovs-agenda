import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk } from "@/lib/api-utils";
import { serializeTeamMember } from "@/lib/team-serializer";
import { saveAvatarUpload, deleteAvatarFile } from "@/lib/upload-utils";

const TEAM_MANAGE_ROLES = ["admin", "fisioterapeuta"];

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole(TEAM_MANAGE_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Membro da equipe não encontrado.", 404);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Nenhuma imagem enviada.", 400);
  }

  const result = await saveAvatarUpload(file, "equipe");
  if (!result.ok) {
    return jsonError(result.error, 400);
  }

  await deleteAvatarFile(existing.avatar);

  const member = await prisma.teamMember.update({
    where: { id },
    data: { avatar: result.url },
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

  await deleteAvatarFile(existing.avatar);

  const member = await prisma.teamMember.update({
    where: { id },
    data: { avatar: null },
  });

  return jsonOk({ member: serializeTeamMember(member) });
}
