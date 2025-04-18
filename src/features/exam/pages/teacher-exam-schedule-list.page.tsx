import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { useTeacherExamSingle } from '../hooks/use-teacher-exam-single.hook';
import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseScene } from '#/base/components/base-scene.component';
import { BaseGroupLink } from '#/base/components/base-group-link.component';
import { TeacherExamScheduleListOverviewBoard } from '../components/teacher-exam-schedule-list-overview-board.component';

import type { GroupLink } from '#/base/models/base.model';
import type { Exam } from '../models/exam.model';
import type { ExamSchedule } from '../models/exam-schedule.model';

export type OutletContextType = {
  exam?: Exam | null;
  examSchedule?: ExamSchedule;
  clearSelectedExamSchedule?: () => void;
};

const sceneTitle = 'Exam Schedule';
const sceneLinks = [
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.exam.to}`,
    label: 'Exam List',
    icons: [{ name: 'plus', size: 16 }, { name: 'exam' }],
  },
  {
    to: `/${teacherBaseRoute}/${teacherRoutes.schedule.to}`,
    label: 'Calendar',
    icons: [{ name: 'calendar' }],
  },
] as GroupLink[];

function TeacherExamScheduleListPage() {
  const { exam } = useTeacherExamSingle();
  const data: any = useLoaderData();
  const [examSchedule, setExamSchedule] = useState<ExamSchedule | undefined>(
    undefined,
  );

  const clearSelectedExamSchedule = useCallback(() => {
    setExamSchedule(undefined);
  }, []);

  useEffect(() => {
    if (!examSchedule) {
      return;
    }

    if (!exam?.schedules?.length && examSchedule) {
      setExamSchedule(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  return (
    <BaseDataSuspense resolve={data?.main}>
      <BaseScene
        title={sceneTitle}
        headerRightContent={<BaseGroupLink links={sceneLinks} />}
      >
        {exam && (
          <div className='w-full py-5'>
            <TeacherExamScheduleListOverviewBoard
              className='mx-auto max-w-compact'
              exam={exam}
              currentExamSchedule={examSchedule}
              onUpsert={setExamSchedule}
            />
            <Outlet
              context={
                {
                  exam,
                  examSchedule,
                  clearSelectedExamSchedule,
                } satisfies OutletContextType
              }
            />
          </div>
        )}
      </BaseScene>
    </BaseDataSuspense>
  );
}

export default TeacherExamScheduleListPage;
