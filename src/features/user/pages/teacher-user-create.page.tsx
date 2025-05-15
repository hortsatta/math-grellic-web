import { useSchoolYearTeacherEnrollmentNewCreate } from '#/school-year/hooks/use-school-year-teacher-enrollment-new-create.hook';
import { TeacherUserUpsertForm } from '../components/teacher-user-upsert-form.component';

function TeacherUserCreatePage() {
  const { schoolYearTitle, isDone, setIsDone, enrollNew } =
    useSchoolYearTeacherEnrollmentNewCreate();

  return (
    <TeacherUserUpsertForm
      schoolYearTitle={schoolYearTitle}
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={enrollNew}
    />
  );
}

export default TeacherUserCreatePage;
