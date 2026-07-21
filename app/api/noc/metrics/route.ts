import { NextResponse } from 'next/server';
import { requireTiAccess } from '@/lib/noc-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireTiAccess();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const baseUrl = process.env.METRICS_SERVICE_URL;
  const secret = process.env.METRICS_INTERNAL_SECRET;

  try {
    const [systemRes, containersRes] = await Promise.all([
      fetch(`${baseUrl}/system`, {
        headers: { 'x-internal-secret': secret! },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      }),
      fetch(`${baseUrl}/containers`, {
        headers: { 'x-internal-secret': secret! },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    if (!systemRes.ok || !containersRes.ok) {
      return NextResponse.json({ error: 'api-metricas retornou erro' }, { status: 502 });
    }

    const [system, containers] = await Promise.all([systemRes.json(), containersRes.json()]);
    return NextResponse.json({ system, containers });
  } catch (error) {
    console.error('[noc/metrics] Falha ao contatar api-metricas:', error);
    return NextResponse.json({ error: 'api-metricas indisponível' }, { status: 503 });
  }
}