import { memo } from 'react';
import cx from 'classix';

import { studentActivityBaseRoute } from '#/activity/route/student-activity-handle.route';
import { BaseLink } from '#/base/components/base-link.component';
import { StudentActivitySingleCard } from '#/activity/components/student-activity-single-card.component';

import type { ComponentProps } from 'react';
import type { Activity } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  activities: Activity[];
};

export const StudentGlobalSearchActivityList = memo(function ({
  className,
  activities,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg leading-none'>Activities</h3>
        <BaseLink
          to={studentActivityBaseRoute}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Activities
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5' role='table'>
        {activities.map((activity) => (
          <StudentActivitySingleCard
            key={`act-${activity.orderNumber}`}
            activity={activity}
          />
        ))}
      </div>
    </div>
  );
});
