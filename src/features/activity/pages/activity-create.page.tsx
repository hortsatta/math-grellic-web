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

export default ActivityCreatePage;
