import { memo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseSearchInput } from '#/base/components/base-search-input.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { ActivitySingleItem } from './activity-single-item.component';

import type { ComponentProps } from 'react';
import type { Activity } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  activities: Activity[];
  onSearchChange: (value: string | null) => void;
  loading?: boolean;
};

export const ActivityList = memo(function ({
  className,
  loading,
  activities,
  onSearchChange,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex flex-col items-center justify-between', className)}
      {...moreProps}
    >
      <div className='w-full overflow-hidden'>
        <div className='px-4'>
          <BaseSearchInput
            placeholder='Find an activity'
            onChange={onSearchChange}
            fullWidth
          />
        </div>
        <div className='relative h-[450px] w-full'>
          {loading && (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          )}
          <OverlayScrollbarsComponent
            className='my-2 h-[450px] w-full px-4'
            defer
          >
            <ul className={cx('w-full', loading && 'opacity-50')}>
              {(activities as Activity[]).map((activity) => (
                <li
                  key={activity.id}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <ActivitySingleItem activity={activity} />
                </li>
              ))}
            </ul>
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </div>
  );
});
