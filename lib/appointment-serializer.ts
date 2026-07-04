import { Appointment as PrismaAppointment } from "@prisma/client";
import { Appointment } from "@/lib/types";

export function serializeAppointment(appt: PrismaAppointment): Appointment {
  return {
    id: appt.id,
    date: appt.date.toISOString().slice(0, 10),
    time: appt.time,
    durationSlots: appt.durationSlots,
    patient: appt.patientName,
    patientId: appt.patientId,
    category: appt.category,
    note: appt.note,
    status: appt.status,
  };
}