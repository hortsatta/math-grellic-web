import { useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';

function SchoolYearListPage() {
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'></div>
        <BaseRightSidebar></BaseRightSidebar>
      </div>
    </BaseDataSuspense>
  );
}

export default SchoolYearListPage;
