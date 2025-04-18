import { useStudentUserCreate } from '../hooks/use-student-user-create.hook';
import { StudentUserUpsertForm } from '../components/student-user-upsert-form.component';

function StudentUserCreatePage() {
  const { isDone, setIsDone, register } = useStudentUserCreate();

  return (
    <StudentUserUpsertForm
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={register}
    />
  );
}

export default StudentUserCreatePage;
