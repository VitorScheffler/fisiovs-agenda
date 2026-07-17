import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return jsonError("Não autenticado.", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      specialty: true,
      crefito: true,
      avatar: true,
      patientId: true,
      teamMember: { select: { avatar: true } },
      patient: { select: { avatar: true } },
    },
  });

  if (!user) {
    return jsonError("Usuário não encontrado.", 404);
  }

  const { teamMember, patient, ...rest } = user;
  return jsonOk({
    user: { ...rest, avatar: user.avatar ?? teamMember?.avatar ?? patient?.avatar ?? null },
  });
}
