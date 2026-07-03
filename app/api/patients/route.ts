import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";
import { serializePatient } from "@/lib/serializers";

const patientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(1, "Telefone é obrigatório."),
  birthDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "Data de nascimento inválida.",
  }),
  cpf: z.string().min(1, "CPF é obrigatório."),
  address: z.string().optional(),
  status: z.enum(["ativo", "inativo", "alta"]).optional(),
  condition: z.string().optional(),
  since: z.string().min(1, "Campo 'since' é obrigatório."),
  notes: z.string().optional(),
});

export async function GET() {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const patients = await prisma.patient.findMany({
    include: { appointmentHistory: true },
    orderBy: { name: "asc" },
  });

  return jsonOk({ patients: patients.map(serializePatient) });
}

export async function POST(request: Request) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = patientSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const data = parsed.data;

  const existingEmail = await prisma.patient.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    return jsonError("Já existe um paciente com este e-mail.", 409);
  }
  const existingCpf = await prisma.patient.findUnique({ where: { cpf: data.cpf } });
  if (existingCpf) {
    return jsonError("Já existe um paciente com este CPF.", 409);
  }

  const patient = await prisma.patient.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthDate: new Date(data.birthDate),
      cpf: data.cpf,
      address: data.address,
      status: data.status ?? "ativo",
      condition: data.condition,
      since: data.since,
      notes: data.notes,
    },
    include: { appointmentHistory: true },
  });

  return jsonOk({ patient: serializePatient(patient) }, 201);
}
