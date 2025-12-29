import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminDashboard from './AdminDashboard';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirection si non authentifié
  if (!session || !session.user) {
    redirect('/admin/login');
  }

  return <AdminDashboard user={session.user} />;
}