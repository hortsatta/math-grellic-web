import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import {
  ActivityCategoryType,
  activityGameLabel,
} from '../models/activity.model';

import type { ComponentProps } from 'react';
import type { Activity, ActivityGame } from '../models/activity.model';

type Props = ComponentProps<'button'> & {
  activity: Activity;
  onClick?: () => void;
};

const chipProps = { className: 'text-xs', iconProps: { size: 16 } };

export const ActivitySingleItem = memo(function ({
  className,
  activity,
  onClick,
  ...moreProps
}: Props) {
  const [title, orderNumber, gameName, gameType] = useMemo(
    () => [
      activity.title,
      `No. ${activity.orderNumber}`,
      activityGameLabel[activity.game.name as ActivityGame],
      activity.game.type,
    ],
    [activity],
  );

  const gameTypeText = useMemo(() => {
    switch (gameType) {
      case ActivityCategoryType.Point:
        return 'Point-based';
      case ActivityCategoryType.Stage:
        return 'Stage-based';
      case ActivityCategoryType.Time:
        return 'Time-based';
    }
  }, [gameType]);

  return (
    <button
      className={cx(
        'group/usrpicker flex w-full items-center justify-between overflow-hidden rounded-md px-4 py-2',
        onClick ? 'hover:bg-primary' : 'pointer-events-none',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div className='flex items-start gap-4 -3xs:items-center'>
        <div className='flex h-11 w-11 items-center justify-center rounded bg-slate-200'>
          <BaseIcon name='game-controller' className='opacity-60' size={36} />
        </div>
        <div
          className={cx(
            'flex flex-col items-start',
            onClick && 'group-hover/usrpicker:text-white',
          )}
        >
          <span className='text-left font-medium'>{title}</span>
          <div className='flex flex-col gap-1 text-left -3xs:flex-row -3xs:items-center -3xs:gap-2.5'>
            <small>{orderNumber}</small>
            <BaseDivider className='hidden !h-4 -3xs:block' vertical />
            <BaseChip iconName='dice-three' {...chipProps}>
              {gameName}
            </BaseChip>
            <BaseDivider className='hidden !h-4 -3xs:block' vertical />
            <BaseChip iconName='flag-pennant' {...chipProps}>
              {gameTypeText}
            </BaseChip>
          </div>
        </div>
      </div>
    </button>
  );
});
