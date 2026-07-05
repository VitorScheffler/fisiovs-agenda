import { Appointment as PrismaAppointment, AppointmentHistoryEntry as PrismaHistoryEntry } from "@prisma/client";
import { Appointment } from "@/lib/types";

type AppointmentWithHistory = PrismaAppointment & {
  historyEntry?: PrismaHistoryEntry | null;
};

export function serializeAppointment(appt: AppointmentWithHistory): Appointment {
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
    historyEntry: appt.historyEntry
      ? {
          complaint: appt.historyEntry.complaint,
          procedure: appt.historyEntry.procedure,
          note: appt.historyEntry.note,
          attended: appt.historyEntry.attended,
          paymentMethod: appt.historyEntry.paymentMethod,
          paid: appt.historyEntry.paid,
          receiptUrl: appt.historyEntry.receiptUrl,
        }
      : null,
  };
}