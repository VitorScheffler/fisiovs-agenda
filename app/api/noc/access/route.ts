import { NextResponse } from 'next/server';
import { requireTiAccess } from '@/lib/noc-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await requireTiAccess();
  return NextResponse.json({ isTi: !!session });
}