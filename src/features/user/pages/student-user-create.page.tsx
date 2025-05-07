import { useSchoolYearStudentEnrollmentNewCreate } from '#/school-year/hooks/use-school-year-student-enrollment-new-create.hook';
import { StudentUserUpsertForm } from '../components/student-user-upsert-form.component';

function StudentUserCreatePage() {
  const { schoolYearTitle, isDone, setIsDone, enrollNew } =
    useSchoolYearStudentEnrollmentNewCreate();

  return (
    <StudentUserUpsertForm
      schoolYearTitle={schoolYearTitle}
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={enrollNew}
    />
  );
}

export default StudentUserCreatePage;
