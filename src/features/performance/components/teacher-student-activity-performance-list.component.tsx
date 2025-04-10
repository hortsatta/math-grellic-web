import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { TeacherStudentActivityPerformanceResult } from './teacher-student-activity-performance-result.component';
import {
  StudentActivityPerformanceSingleCardSkeleton,
  StudentActivityPerformanceSingleCard,
} from './student-activity-performance-single-card.component';

import type { ComponentProps } from 'react';
import type {
  Activity,
  ActivityCategory,
} from '#/activity/models/activity.model';

const ACTIVITY_CREATE_TO = `/${teacherBaseRoute}/${teacherRoutes.activity.to}/${teacherRoutes.activity.createTo}`;

type Props = ComponentProps<'div'> & {
  activities: Activity[];
  loading?: boolean;
};

export const TeacherStudentActivityPerformanceList = memo(function ({
  className,
  loading,
  activities,
  ...moreProps
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const isEmpty = useMemo(() => !activities?.length, [activities]);

  const viewActivityResult = useCallback(
    (activity: Activity) => (category: ActivityCategory) => {
      setCurrentActivity({
        ...activity,
        categories: activity.categories.filter((cat) => cat.id === category.id),
      });
      setOpenModal(true);
    },
    [],
  );

  const handleClose = useCallback(() => setCurrentActivity(null), []);

  useEffect(() => {
    setOpenModal(!!currentActivity);
  }, [currentActivity]);

  return (
    <>
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
          <BaseDataEmptyMessage
            message='No activities available'
            linkTo={ACTIVITY_CREATE_TO}
          />
        ) : (
          activities.map((activity) => (
            <StudentActivityPerformanceSingleCard
              key={`act-${activity.id}`}
              activity={activity}
              role='row'
              onResult={viewActivityResult(activity)}
            />
          ))
        )}
      </div>
      <BaseModal open={openModal} onClose={handleClose}>
        {currentActivity && (
          <TeacherStudentActivityPerformanceResult
            slug={currentActivity.slug}
            categoryId={currentActivity.categories[0].id}
          />
        )}
      </BaseModal>
    </>
  );
});
