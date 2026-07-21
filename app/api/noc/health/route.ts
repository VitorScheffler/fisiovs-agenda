import { NextResponse } from 'next/server';
import { requireTiAccess } from '@/lib/noc-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Status = 'up' | 'down' | 'degraded';

interface ServiceCheck {
  name: string;
  status: Status;
  latencyMs: number | null;
  message?: string;
}

async function checkDatabase(): Promise<ServiceCheck> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      name: 'Banco de dados (SQLite/Prisma)',
      status: 'up',
      latencyMs: Date.now() - start,
    };
  } catch {
    return {
      name: 'Banco de dados (SQLite/Prisma)',
      status: 'down',
      latencyMs: null,
      message: 'Falha na query de teste',
    };
  }
}

async function checkMetricsService(): Promise<ServiceCheck> {
  const start = Date.now();
  const baseUrl = process.env.METRICS_SERVICE_URL;

  if (!baseUrl) {
    return {
      name: 'api-metricas',
      status: 'down',
      latencyMs: null,
      message: 'METRICS_SERVICE_URL não configurada',
    };
  }

  try {
    const res = await fetch(`${baseUrl}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    return {
      name: 'api-metricas',
      status: res.ok ? 'up' : 'degraded',
      latencyMs: Date.now() - start,
    };
  } catch {
    return {
      name: 'api-metricas',
      status: 'down',
      latencyMs: null,
      message: 'Sem resposta',
    };
  }
}

export async function GET() {
  const session = await requireTiAccess();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const [db, metrics] = await Promise.all([checkDatabase(), checkMetricsService()]);

  const services: ServiceCheck[] = [
    { name: 'API Next.js (fisiovs-agenda)', status: 'up', latencyMs: 0 },
    db,
    metrics,
  ];

  const overall: Status = services.some((s) => s.status === 'down')
    ? 'down'
    : services.some((s) => s.status === 'degraded')
    ? 'degraded'
    : 'up';

  return NextResponse.json({ overall, services, checkedAt: new Date().toISOString() });
}