-- A migration "20260704133233_add_appointment_date" nunca de fato adicionou a
-- coluna "date" na tabela Appointment (ela só criou a ClinicSettings por engano).
-- A tabela Appointment ficou presa no formato antigo, com uma coluna "day"
-- (índice do dia da semana) que não existe mais no schema.prisma atual, que
-- espera "date" (DateTime). Isso fazia todo INSERT/SELECT em Appointment
-- (ex: criar um novo agendamento) falhar com erro 500, pois a coluna "date"
-- não existe de fato no banco.
--
-- Dados de teste existentes em Appointment são descartados aqui (combinado).

PRAGMA foreign_keys=OFF;

-- Remove qualquer referência de histórico à Appointment antes de recriar a tabela,
-- para não deixar FK quebrada (histórico em si é preservado, só desvinculado).
UPDATE "AppointmentHistoryEntry" SET "appointmentId" = NULL;

DROP TABLE IF EXISTS "Appointment";

CREATE TABLE "Appointment" (
    "id"            TEXT NOT NULL PRIMARY KEY,
    "date"          DATETIME NOT NULL,
    "time"          TEXT NOT NULL,
    "durationSlots" INTEGER NOT NULL DEFAULT 1,
    "patientId"     TEXT,
    "patientName"   TEXT NOT NULL,
    "category"      TEXT NOT NULL,
    "note"          TEXT,
    "status"        TEXT NOT NULL DEFAULT 'confirmado',
    "cancelReason"  TEXT,
    "createdAt"     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     DATETIME NOT NULL,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

PRAGMA foreign_keys=ON;
