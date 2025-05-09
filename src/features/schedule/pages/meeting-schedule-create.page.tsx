import { useBoundStore } from '#/core/hooks/use-store.hook';
import { useMeetingScheduleCreate } from '../hooks/use-meeting-schedule-create.hook';
import { MeetingScheduleUpsertForm } from '../components/meeting-schedule-upsert-form.component';

function MeetingScheduleCreatePage() {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const { isDone, setIsDone, createMeetingSchedule } =
    useMeetingScheduleCreate();

  return (
    schoolYear && (
      <MeetingScheduleUpsertForm
        schoolYearId={schoolYear.id}
        isDone={isDone}
        onDone={setIsDone}
        onSubmit={createMeetingSchedule}
      />
    )
  );
}

export default MeetingScheduleCreatePage;
