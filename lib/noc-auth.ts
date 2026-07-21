import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type TiSession = {
  userId: string;
  email: string;
  name: string;
};

/**
 * Confirma que o usuário logado está autenticado E é um TeamMember com
 * role TI. Retorna a sessão se autorizado, ou null caso contrário.
 * Uso: nas rotas /api/noc/*, sempre checar antes de responder qualquer dado.
 */
export async function requireTiAccess(): Promise<TiSession | null> {
  const session = await getSession();
  if (!session) return null;

  const teamMember = await prisma.teamMember.findUnique({
    where: { userId: session.userId },
    select: { role: true },
  });

  if (teamMember?.role !== 'TI') return null;

  return { userId: session.userId, email: session.email, name: session.name };
}