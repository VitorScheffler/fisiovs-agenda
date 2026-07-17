import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-utils";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      teamMember: { select: { avatar: true } },
      patient: { select: { avatar: true } },
    },
  });
  if (!user) {
    return jsonError("E-mail ou senha incorretos.", 401);
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return jsonError("E-mail ou senha incorretos.", 401);
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return jsonOk({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty,
      crefito: user.crefito,
      avatar: user.avatar ?? user.teamMember?.avatar ?? user.patient?.avatar ?? null,
      patientId: user.patientId,
    },
  });
}
