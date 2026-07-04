import { Patient as PrismaPatient, AppointmentHistoryEntry as PrismaHistory } from "@prisma/client";
import { Patient } from "@/lib/types";

type PatientWithHistory = PrismaPatient & {
  appointmentHistory: PrismaHistory[];
};

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function serializePatient(patient: PatientWithHistory): Patient {
  return {
    id: patient.id,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    birthDate: toIsoDate(patient.birthDate),
    cpf: patient.cpf,
    address: patient.address,
    status: patient.status,
    condition: patient.condition,
    since: patient.since,
    notes: patient.notes,
    appointmentHistory: patient.appointmentHistory.map((h) => ({
      id: h.id,
      appointmentId: h.appointmentId,
      date: h.date,
      time: h.time,
      category: h.category,
      complaint: h.complaint,
      procedure: h.procedure,
      note: h.note ?? undefined,
      attended: h.attended,
      paymentMethod: h.paymentMethod,
      paid: h.paid,
      receiptUrl: h.receiptUrl,
      status: h.status,
    })),
  };
}

