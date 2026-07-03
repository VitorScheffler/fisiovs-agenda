import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializePatient } from "@/lib/serializers";

const patientUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email("E-mail inválido.").optional(),
  phone: z.string().min(1).optional(),
  birthDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Data de nascimento inválida." })
    .optional(),
  cpf: z.string().min(1).optional(),
  address: z.string().nullable().optional(),
  status: z.enum(["ativo", "inativo", "alta"]).optional(),
  condition: z.string().nullable().optional(),
  since: z.string().min(1).optional(),
  notes: z.string().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { appointmentHistory: true },
  });

  if (!patient) {
    return jsonError("Paciente não encontrado.", 404);
  }

  return jsonOk({ patient: serializePatient(patient) });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = patientUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Paciente não encontrado.", 404);
  }

  const data = parsed.data;

  if (data.email) {
    const conflict = await prisma.patient.findUnique({ where: { email: data.email } });
    if (conflict && conflict.id !== id) {
      return jsonError("Já existe um paciente com este e-mail.", 409);
    }
  }
  if (data.cpf) {
    const conflict = await prisma.patient.findUnique({ where: { cpf: data.cpf } });
    if (conflict && conflict.id !== id) {
      return jsonError("Já existe um paciente com este CPF.", 409);
    }
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
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

  await prisma.patient.delete({ where: { id } });

  return jsonOk({ success: true });
}
