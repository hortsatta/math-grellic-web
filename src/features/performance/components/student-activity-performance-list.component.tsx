import { memo, useMemo } from 'react';
import cx from 'classix';

import {
  StudentActivityPerformanceSingleCardSkeleton,
  StudentActivityPerformanceSingleCard,
} from './student-activity-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { Activity } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  activities: Activity[];
  loading?: boolean;
};

export const StudentActivityPerformanceList = memo(function ({
  className,
  loading,
  activities,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !activities?.length, [activities]);

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {loading ? (
        [...Array(4)].map((_, index) => (
          <StudentActivityPerformanceSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <div className='w-full py-4 text-center'>No activities to show</div>
      ) : (
        activities.map((activity) => (
          <StudentActivityPerformanceSingleCard
            key={`act-${activity.id}`}
            activity={activity}
            role='row'
          />
        ))
      )}
    </div>
  );
});
