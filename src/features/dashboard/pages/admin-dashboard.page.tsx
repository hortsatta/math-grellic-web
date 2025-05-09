import { useBoundStore } from '#/core/hooks/use-store.hook';
import { AdminDashboardUserSummary } from '../components/admin-dashboard-user-summary.component';

function AdminDashboardPage() {
  const user = useBoundStore((state) => state.user || null);

  return (
    <div className='max-w-auto mx-auto flex w-full flex-col items-center justify-center gap-5 pb-8 sm:max-w-[592px] -2lg:max-w-[835px] xl:flex-row xl:items-start'>
      <div className='xl:max-w-auto flex w-full shrink-0 flex-col gap-5 xl:w-[592px] xl:pb-8 2xl:w-auto 2xl:max-w-[835px]'>
        <AdminDashboardUserSummary
          className='min-h-[262px]'
          user={user}
          loading={!user}
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
