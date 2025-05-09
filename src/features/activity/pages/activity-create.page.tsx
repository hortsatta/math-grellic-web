import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useActivityCreate } from '../hooks/use-activity-create.hook';
import { ActivityUpsertForm } from '../components/activity-upsert-form.component';

function ActivityCreatePage() {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const { loading, isDone, setIsDone, createActivity } = useActivityCreate();

  return (
    schoolYear && (
      <ActivityUpsertForm
        schoolYearId={schoolYear.id}
        loading={loading}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={createActivity}
      />
    )
  );
}

export default ActivityCreatePage;
