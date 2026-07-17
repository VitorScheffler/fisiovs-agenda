import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializePatient } from "@/lib/serializers";
import { saveAvatarUpload, deleteAvatarFile } from "@/lib/upload-utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const existing = await prisma.patient.findUnique({
    where: { id },
    include: { appointmentHistory: true },
  });
  if (!existing) {
    return jsonError("Paciente não encontrado.", 404);
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

  const result = await saveAvatarUpload(file, "pacientes");
  if (!result.ok) {
    return jsonError(result.error, 400);
  }

  await deleteAvatarFile(existing.avatar);

  const patient = await prisma.patient.update({
    where: { id },
    data: { avatar: result.url },
    include: { appointmentHistory: true },
  });

  return jsonOk({ patient: serializePatient(patient) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Paciente não encontrado.", 404);
  }

  await deleteAvatarFile(existing.avatar);

  const patient = await prisma.patient.update({
    where: { id },
    data: { avatar: null },
    include: { appointmentHistory: true },
  });

  return jsonOk({ patient: serializePatient(patient) });
}
