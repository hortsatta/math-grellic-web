import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseTag } from '#/base/components/base-tag.component';
import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = ComponentProps<typeof BaseSurface> & {
  lesson: Lesson;
  onResult?: (lesson: Lesson) => void;
};

export const StudentLessonPerformanceSingleCard = memo(function ({
  className,
  lesson,
  onClick,
  ...moreProps
}: Props) {
  const [orderNumber, title, hasCompleted] = useMemo(
    () => [lesson.orderNumber, lesson.title, !!lesson.completions?.length],
    [lesson],
  );

  const isUpcoming = useMemo(
    () => (lesson.schedules?.length ? lesson.schedules[0].isUpcoming : false),
    [lesson],
  );

  const statusText = useMemo(() => {
    if (isUpcoming) return 'Upcoming';

    return hasCompleted ? 'Completed' : 'Pending';
  }, [hasCompleted, isUpcoming]);

  return (
    <BaseSurface className={cx('!p-0', className)} rounded='sm' {...moreProps}>
      <div
        className='flex h-auto w-full flex-col items-start justify-between gap-2.5 rounded-md px-4 py-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus sm:flex-row sm:items-center sm:gap-5'
        onClick={onClick}
      >
        <div className='flex items-center gap-x-2.5'>
          {hasCompleted ? (
            <BaseIcon
              className='text-green-500'
              name='check-circle'
              size={28}
              weight='bold'
            />
          ) : (
            <BaseIcon
              className={!isUpcoming ? 'text-red-500' : 'text-accent/40'}
              name='x-circle'
              size={28}
              weight='bold'
            />
          )}
          <span>
            Lesson {orderNumber} - {title}
          </span>
        </div>
        <div className='flex items-center gap-x-4 text-primary group-hover:text-white'>
          <BaseTag className='w-28 !bg-primary'>{statusText}</BaseTag>
        </div>
      </div>
    </BaseSurface>
  );
});

export const StudentLessonPerformanceSingleCardSkeleton = memo(function () {
  return (
    <div className='flex w-full animate-pulse flex-col justify-between gap-2.5 rounded-lg bg-accent/20 py-2.5 pl-2.5 pr-4 sm:h-[54px] sm:flex-row'>
      <div className='flex items-center gap-2.5'>
        <div className='h-[34px] w-[34px] shrink-0 rounded bg-accent/20' />
        <div className='h-6 w-[200px] rounded bg-accent/20' />
      </div>
      <div className='flex w-full items-center gap-2.5 sm:w-auto'>
        <div className='flex w-[80px] flex-col gap-2.5 sm:w-full sm:flex-row sm:gap-4'>
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-20 sm:w-20' />
          <div className='h-6 w-full rounded bg-accent/20 -3xs:w-20 sm:w-20' />
        </div>
        <div className='h-full w-28 rounded bg-accent/20' />
      </div>
    </div>
  );
});
