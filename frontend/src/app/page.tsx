import { createClient } from '@/lib/supabase/server';
import { getDashboardData } from '@/lib/dashboard-data';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  let initialDashData = null;
  if (user?.id) {
    initialDashData = await getDashboardData(user.id, supabase);
  }

  return (
    <DashboardClient initialDashData={initialDashData} />
  );
}
