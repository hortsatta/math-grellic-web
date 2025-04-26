import { useLoaderData } from 'react-router-dom';

import { BasePageSpinner } from '#/base/components/base-spinner.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useSchoolYearSingle } from '../hooks/use-school-year-single.hook';
import { SchoolYearSingle } from '../components/school-year-single.component';

function SchoolYearSinglePage() {
  const { schoolYear, loading } = useSchoolYearSingle();
  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      {loading && <BasePageSpinner />}
      {schoolYear && (
        <SchoolYearSingle
          className='mx-auto max-w-compact py-5'
          schoolYear={schoolYear}
        />
      )}
    </BaseDataSuspense>
  );
}

export default SchoolYearSinglePage;
