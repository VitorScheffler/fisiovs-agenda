import { User } from "./types";

export const USERS: User[] = [
  {
    id: "u1",
    name: "Vitoria Schmitz",
    email: "vi@fisiovs.com",
    password: "admin123",
    role: "admin",
    specialty: "Fisioterapia Ortopédica e Esportiva",
    crefito: "CREFITO-5 / 123456-F",
    avatar: undefined,
  },
  {
    id: "u2",
    name: "Camila Souza",
    email: "camila@email.com",
    password: "paciente123",
    role: "paciente",
    patientId: "p1",
  },
  {
    id: "u3",
    name: "Rafael Costa",
    email: "rafael@fisiovs.com",
    password: "fisio123",
    role: "fisioterapeuta",
    specialty: "Fisioterapia Neurológica",
    crefito: "CREFITO-5 / 234567-F",
  },
  {
    id: "u4",
    name: "Larissa Nunes",
    email: "larissa@fisiovs.com",
    password: "sec123",
    role: "secretaria",
  },
];

export function findUser(email: string, password: string): User | null {
  return USERS.find((u) => u.email === email && u.password === password) ?? null;
}