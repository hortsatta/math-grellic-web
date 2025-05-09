import { useSchoolYearCreate } from '../hooks/use-school-year-create.hook';
import { SchoolYearUpsertForm } from '../components/school-year-upsert-form.component';

function SchoolYearCreatePage() {
  const { isDone, setIsDone, createSchoolYear } = useSchoolYearCreate();

  return (
    <SchoolYearUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createSchoolYear}
    />
  );
}

export default SchoolYearCreatePage;
