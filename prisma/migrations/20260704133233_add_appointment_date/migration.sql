-- CreateTable
CREATE TABLE "ClinicSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "horarioInicio" TEXT NOT NULL DEFAULT '08:00',
    "horarioFim" TEXT NOT NULL DEFAULT '18:00',
    "duracaoConsulta" INTEGER NOT NULL DEFAULT 60,
    "intervaloConsulta" INTEGER NOT NULL DEFAULT 15,
    "updatedAt" DATETIME NOT NULL
);
