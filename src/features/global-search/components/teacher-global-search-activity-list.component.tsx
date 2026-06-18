import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { TeacherActivitySingleCard } from '#/activity/components/teacher-activity-single-card.component';

import type { ComponentProps } from 'react';
import type { Activity } from '#/activity/models/activity.model';

type Props = ComponentProps<'div'> & {
  activities: Activity[];
};

const ACTIVITY_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.activity.to}`;

export const TeacherGlobalSearchActivityList = memo(function ({
  className,
  activities,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const handleActivityPreview = useCallback(
    (slug: string) => () => {
      window
        .open(
          `${ACTIVITY_LIST_PATH}/${slug}/${teacherRoutes.activity.previewTo}`,
          '_blank',
        )
        ?.focus();
    },
    [],
  );

  const handleActivityDetails = useCallback(
    (slug: string) => () => {
      navigate(`${ACTIVITY_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleActivityEdit = useCallback(
    (slug: string) => () => {
      navigate(
        `${ACTIVITY_LIST_PATH}/${slug}/${teacherRoutes.activity.editTo}`,
      );
    },
    [navigate],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg leading-none'>Activities</h3>
        <BaseLink
          to={ACTIVITY_LIST_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Activities
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5'>
        {activities.map((activity) => (
          <TeacherActivitySingleCard
            key={`act-${activity.id}`}
            activity={activity}
            onPreview={handleActivityPreview(activity.slug)}
            onDetails={handleActivityDetails(activity.slug)}
            onEdit={handleActivityEdit(activity.slug)}
            role='row'
          />
        ))}
      </div>
    </div>
  );
});
