import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { convertSecondsToDuration, getDayJsDuration } from '#/utils/time.util';
import { stripHtml } from '#/utils/html.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';
import { LessonSingleItem } from '#/lesson/components/lesson-single-item.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  onStart: () => void;
  exam: Exam;
  description?: string;
  coveredLessons?: Partial<Lesson>[];
};

export const StudentExamTakeStart = memo(function ({
  className,
  exam,
  onStart,
  ...moreProps
}: Props) {
  const [
    orderNumber,
    coveredLessons,
    description,
    totalPoints,
    passingPoints,
    schedule,
  ] = useMemo(
    () => [
      exam.orderNumber,
      exam.coveredLessons,
      exam.description || '',
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      exam.passingPoints,
      exam.schedules?.length ? exam.schedules[0] : null,
    ],
    [exam],
  );

  const [scheduleTitle, scheduleDate, scheduleTime, scheduleDuration] =
    useMemo(() => {
      if (!schedule) {
        return [];
      }

      const { title, startDate, endDate } = schedule;

      if (!dayjs(startDate).isSame(endDate, 'day')) {
        return [];
      }

      const date = dayjs(startDate).format('MMM DD, YYYY');
      const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
        endDate,
      ).format('hh:mm A')}`;
      const duration = getDayJsDuration(endDate, startDate).asSeconds();

      return [title, date, time, convertSecondsToDuration(duration)];
    }, [schedule]);

  const isDescriptionEmpty = useMemo(() => {
    const result = stripHtml(description);
    return !result.trim().length;
  }, [description]);

  const totalPointsText = useMemo(
    () =>
      totalPoints > 1
        ? `${totalPoints} Total Points`
        : `${totalPoints} Total Point`,
    [totalPoints],
  );

  const passingPointsText = useMemo(
    () =>
      passingPoints > 1
        ? `${passingPoints} Passing Points`
        : `${passingPoints} Passing Point`,
    [passingPoints],
  );

  return (
    <div
      className={cx('flex w-full flex-col items-center gap-y-8 p-4', className)}
      {...moreProps}
    >
      <div className='flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row -2xs:gap-0 [.primary_&]:text-white'>
        {schedule && (
          <div className='flex flex-col gap-1'>
            <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
              {scheduleTitle}
            </h2>
            <BaseChip iconName='calendar-check'>{scheduleDate}</BaseChip>
            <BaseChip iconName='clock'>{scheduleTime}</BaseChip>
            <BaseChip iconName='hourglass'>{scheduleDuration}</BaseChip>
          </div>
        )}
        <div className='flex flex-col gap-1'>
          <BaseChip iconName='exam'>Exam {orderNumber}</BaseChip>
          <BaseChip iconName='list-numbers'>{totalPointsText}</BaseChip>
          <BaseChip iconName='list-checks'>{passingPointsText}</BaseChip>
        </div>
      </div>
      <BaseSurface className='w-full bg-white px-4' rounded='sm'>
        <span className='mb-4 block font-medium'>Covered Lessons</span>
        {coveredLessons?.length ? (
          <div className='flex flex-col'>
            {coveredLessons?.map((lesson) => (
              <LessonSingleItem
                key={`li-${lesson.id}`}
                lesson={lesson as Lesson}
              />
            ))}
          </div>
        ) : (
          <div className='flex w-full justify-center'>None</div>
        )}
      </BaseSurface>
      {!isDescriptionEmpty && (
        <div className='w-full'>
          <BaseDivider />
          <div className='base-rich-text rt-output py-5'>
            <BaseRichTextOutput
              className='border-0 p-0'
              label='Description'
              text={description}
              unboxed
            />
          </div>
          <BaseDivider />
        </div>
      )}
      <BaseButton rightIconName='play' onClick={onStart}>
        Start Exam
      </BaseButton>
    </div>
  );
});
