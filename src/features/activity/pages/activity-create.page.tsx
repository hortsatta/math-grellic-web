import { teacherActivityRouteHandle } from '../route/teacher-activity-handle.route';
import { useActivityCreate } from '../hooks/use-activity-create.hook';
import { ActivityUpsertForm } from '../components/activity-upsert-form.component';

function ActivityCreatePage() {
  const { loading, isDone, setIsDone, createActivity } = useActivityCreate();

  return (
    <ActivityUpsertForm
      loading={loading}
      isDone={isDone}
      onDone={setIsDone}
      onSubmit={createActivity}
    />
  );
}

export const Component = ActivityCreatePage;
export const handle = teacherActivityRouteHandle.create;
