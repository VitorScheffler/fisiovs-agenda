import { TeamMember as PrismaTeamMember } from "@prisma/client";
import { TeamMember } from "@/lib/types";

export function serializeTeamMember(member: PrismaTeamMember): TeamMember {
  return {
    id: member.id,
    userId: member.userId,
    name: member.name,
    role: member.role === "Secretaria" ? "Secretaria" : member.role,
    specialty: member.specialty,
    crefito: member.crefito,
    email: member.email,
    phone: member.phone,
    status: member.status,
    since: member.since,
    initials: member.initials,
    color: member.color,
  };
}
