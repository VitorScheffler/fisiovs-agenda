import { z } from "zod";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError, jsonOk, STAFF_ROLES } from "@/lib/api-utils";

const atendimentoSchema = z.object({
  complaint: z.string().optional(),
  procedure: z.string().optional(),
  note: z.string().optional(),
  attended: z.enum(["true", "false"]),
  paymentMethod: z.enum(["dinheiro", "pix", "cartao", "convenio", "isento"]).optional(),
  paid: z.enum(["true", "false"]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole(STAFF_ROLES);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return jsonError("Agendamento não encontrado.", 404);
  }
  if (!appointment.patientId) {
    return jsonError("Este agendamento não está vinculado a um paciente cadastrado.", 400);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = atendimentoSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400);
  }
  const data = parsed.data;

  let receiptUrl: string | undefined;
  const file = formData.get("receipt");
  if (file instanceof File && file.size > 0) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || "";
    const filename = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "comprovantes");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);
    receiptUrl = `/uploads/comprovantes/${filename}`;
  }

  const dateLabel = new Date().toLocaleDateString("pt-BR");

  const historyEntry = await prisma.appointmentHistoryEntry.upsert({
    where: { appointmentId: id },
    update: {
      complaint: data.complaint || undefined,
      procedure: data.procedure || undefined,
      note: data.note || undefined,
      attended: data.attended === "true",
      paymentMethod: data.paymentMethod,
      paid: data.paid === "true",
      ...(receiptUrl ? { receiptUrl } : {}),
    },
    create: {
      patientId: appointment.patientId,
      appointmentId: id,
      date: dateLabel,
      time: appointment.time,
      category: appointment.category,
      complaint: data.complaint || undefined,
      procedure: data.procedure || undefined,
      note: data.note || undefined,
      attended: data.attended === "true",
      paymentMethod: data.paymentMethod,
      paid: data.paid === "true",
      receiptUrl,
      status: appointment.status,
    },
  });

  return jsonOk({ historyEntry });
}