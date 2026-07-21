import { redirect } from 'next/navigation';
import { requireTiAccess } from '@/lib/noc-auth';
import { NocDashboard } from '@/components/noc/NocDashboard';

export const metadata = { title: 'NOC — fisiovs-agenda' };

export default async function NocPage() {
  const session = await requireTiAccess();

  if (!session) {
    redirect('/login?redirect=/noc');
  }

  return <NocDashboard />;
}