import { memo, useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { TeacherExamScheduleSingleCard } from './teacher-exam-schedule-single-card.component';
import { TeacherExamScheduleDetails } from './teacher-exam-schedule-details.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';
import type { ExamSchedule } from '../models/exam-schedule.model';

type Props = ComponentProps<'div'> & {
  exam: Exam;
  currentExamSchedule?: ExamSchedule;
  onUpsert?: (examSchedule: ExamSchedule | undefined) => void;
};

export const TeacherExamScheduleListOverviewBoard = memo(function ({
  className,
  exam,
  currentExamSchedule,
  onUpsert,
}: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(
    null,
  );

  const [orderNumber, title, totalPoints, schedules] = useMemo(
    () => [
      exam.orderNumber,
      exam.title,
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      exam.schedules,
    ],
    [exam],
  );

  const totalPointsText = useMemo(
    () =>
      totalPoints > 1
        ? `${totalPoints} Total Points`
        : `${totalPoints} Total Point`,
    [totalPoints],
  );

  const isUpsert = useMemo(() => {
    const paths = pathname.split('/');
    const currentPath = paths[paths.length - 1];
    return (
      currentPath === teacherRoutes.lesson.schedule.editTo ||
      currentPath === teacherRoutes.lesson.schedule.createTo
    );
  }, [pathname]);

  const targetSchedules = useMemo(() => {
    if (!schedules?.length) {
      return [];
    }

    if (isUpsert) {
      return currentExamSchedule ? [currentExamSchedule] : [];
    }

    return schedules;
  }, [schedules, currentExamSchedule, isUpsert]);

  const handleUpsertSchedule = useCallback(
    (examSchedule?: ExamSchedule) => () => {
      if (isUpsert) {
        onUpsert && onUpsert(undefined);
        navigate('.');
        return;
      }

      if (examSchedule) {
        onUpsert && onUpsert(examSchedule);
        navigate(teacherRoutes.lesson.schedule.editTo);
      } else {
        onUpsert && onUpsert(undefined);
        navigate(teacherRoutes.lesson.schedule.createTo);
      }
    },
    [isUpsert, navigate, onUpsert],
  );

  const selectSchedule = useCallback(
    (schedule: ExamSchedule) => () => setSelectedSchedule(schedule),
    [],
  );

  const handleCloseModal = useCallback(() => setSelectedSchedule(null), []);

  return (
    <>
      <div className={cx('w-full', className)}>
        {/* Exam details */}
        <div className='flex w-full flex-col items-start justify-between gap-2.5 sm:flex-row sm:items-center'>
          <h2 className='text-xl sm:pb-1'>{title}</h2>
          <div className='flex items-center gap-2.5'>
            <BaseChip iconName='exam'>Exam {orderNumber}</BaseChip>
            <BaseDivider className='!h-6' vertical />
            <BaseChip iconName='list-numbers'>{totalPointsText}</BaseChip>
          </div>
        </div>
        {/* Exam schedules */}
        {!!targetSchedules?.length &&
          targetSchedules.map((schedule, index) => (
            <BaseSurface
              key={index}
              className={cx(
                'my-2.5 flex flex-col gap-1 !px-6 !py-3',
                !isUpsert &&
                  'cursor-pointer hover:!border-primary-hue-purple-focus hover:shadow-md hover:ring-1 hover:ring-primary-hue-purple-focus',
              )}
              rounded='xs'
              onClick={selectSchedule(schedule)}
            >
              <TeacherExamScheduleSingleCard
                schedule={schedule}
                isUpsert={isUpsert}
                onUpsert={handleUpsertSchedule(
                  schedules?.length ? schedules[index] : undefined,
                )}
              />
            </BaseSurface>
          ))}
        {!currentExamSchedule && (
          <BaseButton
            className='mt-2.5 w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary hover:text-white sm:mt-0'
            leftIconName={isUpsert ? 'x-circle' : 'plus-circle'}
            variant='link'
            size='sm'
            onClick={handleUpsertSchedule()}
          >
            {isUpsert ? 'Cancel New Schedule' : 'Add Schedule'}
          </BaseButton>
        )}
      </div>
      <BaseModal
        className='!min-h-0 !border-0 !px-0 !pb-8 xs:!px-10'
        size='sm'
        open={!!selectedSchedule}
        onClose={handleCloseModal}
      >
        {selectedSchedule && (
          <TeacherExamScheduleDetails schedule={selectedSchedule} />
        )}
      </BaseModal>
    </>
  );
});
