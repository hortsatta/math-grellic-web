import { memo, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { RecordStatus } from '#/core/models/core.model';
import { BaseItemCounterButton } from '#/base/components/base-item-counter-button.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getActivitiesByTeacherId } from '../api/admin-activity.api';
import { transformToActivity } from '../helpers/activity-transform.helper';
import { ActivityList } from './activity-list.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  activityCount: number;
  teacherId: number;
  schoolYearId?: number;
  loading?: boolean;
};

export const ActivityCounterList = memo(function ({
  loading,
  activityCount,
  teacherId,
  schoolYearId,
  ...moreProps
}: Props) {
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: activities,
    isLoading: isActivityLoading,
    isFetching: isActivityFetching,
    refetch,
  } = useQuery(
    getActivitiesByTeacherId(
      { teacherId, q: keyword, status: RecordStatus.Published, schoolYearId },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!keyword,
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToActivity(item))
            : undefined,
      },
    ),
  );

  const totalActivityCountText = useMemo(() => {
    if (!activityCount) {
      return 'No activities created';
    }

    return `${activityCount > 1 ? 'Activities' : 'Activity'} created`;
  }, [activityCount]);

  const toggleModal = useCallback(
    (open: boolean) => () => setOpenModal(open),
    [],
  );

  const handleButtonClick = useCallback(() => {
    if (activities == null) refetch();
    toggleModal(true)();
  }, [activities, toggleModal, refetch]);

  const handleSearchChange = useCallback((value: string | null) => {
    setKeyword(value || undefined);
  }, []);

  return (
    <>
      <div {...moreProps}>
        {loading ? (
          <div className='flex h-[86px] w-[147px] items-center justify-center'>
            <BaseSpinner size='sm' />
          </div>
        ) : (
          <BaseItemCounterButton
            className='hover:!border-primary-hue-teal-focus hover:!ring-primary-hue-teal-focus'
            countClassName='text-primary-hue-teal'
            count={activityCount}
            countLabel={totalActivityCountText}
            iconName='game-controller'
            onClick={handleButtonClick}
          />
        )}
      </div>
      <BaseModal open={openModal} onClose={toggleModal(false)}>
        <ActivityList
          activities={activities || []}
          loading={isActivityLoading || isActivityFetching}
          onSearchChange={handleSearchChange}
        />
      </BaseModal>
    </>
  );
});
