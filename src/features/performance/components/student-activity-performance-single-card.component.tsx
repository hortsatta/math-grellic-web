import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import {
  ActivityCategoryType,
  activityGameLabel,
} from '#/activity/models/activity.model';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseTag } from '#/base/components/base-tag.component';
import { StudentActivityCompletionHistoryItem } from '#/activity/components/student-activity-completion-history-item.component';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type {
  Activity,
  ActivityCategory,
  ActivityGame,
} from '#/activity/models/activity.model';

type Props = ComponentProps<typeof BaseSurface> & {
  activity: Activity;
  onResult?: (category: ActivityCategory) => void;
};

enum ActivityStatus {
  Pending = 0,
  Incomplete,
  Completed,
}

type CategoryListProps = {
  categories: ActivityCategory[];
  isPointType: boolean;
  onResult?: (category: ActivityCategory) => void;
};

const CategoryList = memo(
  ({ isPointType, categories, onResult }: CategoryListProps) => {
    const handleResult = useCallback(
      (category: ActivityCategory) => () => {
        onResult && onResult(category);
      },
      [onResult],
    );

    return (
      <div className='flex flex-col px-2.5 pb-2.5'>
        <BaseDivider />
        {categories.map((category) => (
          <StudentActivityCompletionHistoryItem
            key={`act-${category.id}`}
            className='p-2.5'
            category={category}
            isPointType={isPointType}
            onClick={onResult ? handleResult(category) : undefined}
          />
        ))}
      </div>
    );
  },
);

export const StudentActivityPerformanceSingleCard = memo(function ({
  className,
  activity,
  onResult,
  ...moreProps
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [orderNumber, title, gameName, gameType, categories, rank] = useMemo(
    () => [
      activity.orderNumber,
      activity.title,
      activityGameLabel[activity.game.name as ActivityGame],
      activity.game.type,
      activity.categories,
      activity.rank,
    ],
    [activity],
  );

  const [completions, status, statusText] = useMemo(() => {
    let status = ActivityStatus.Pending;
    let statusText = ActivityStatus[0];
    const completions = categories
      .map((cat) => (cat.completions?.length ? cat.completions[0] : null))
      .filter((com) => !!com);

    if (completions.length) {
      if (gameType === ActivityCategoryType.Stage) {
        status = ActivityStatus.Completed;
        statusText = ActivityStatus[2];
      } else {
        if (completions.length >= 3) {
          status = ActivityStatus.Completed;
          statusText = ActivityStatus[2];
        } else {
          status = ActivityStatus.Incomplete;
          statusText = ActivityStatus[1];
        }
      }
    }

    return [completions, status, statusText];
  }, [gameType, categories]);

  const scoreText = useMemo(() => {
    if (!completions.length) {
      return '-';
    }

    switch (gameType) {
      case ActivityCategoryType.Point: {
        const score = completions.reduce(
          (total, com) => total + (com?.score || 0),
          0,
        );

        return `${score} ${score > 1 ? 'Pts' : 'Pt'}`;
      }
      case ActivityCategoryType.Time: {
        if (completions.length !== 3) {
          return '-';
        }

        const score =
          completions.reduce(
            (total, com) => total + (com?.timeCompletedSeconds || 0),
            0,
          ) / 3;

        return `${score} ${score > 1 ? 'Secs' : 'Sec'}`;
      }
      case ActivityCategoryType.Stage: {
        const score = completions[0]?.score || 0;
        return `${score} ${score > 1 ? 'Lvls' : 'Lvl'}`;
      }
    }
  }, [gameType, completions]);

  const rankText = useMemo(
    () => (rank == null ? '-' : generateOrdinalSuffix(rank)),
    [rank],
  );

  const handleClick = useCallback(() => {
    if (gameType === ActivityCategoryType.Stage) {
      onResult && onResult(categories[0]);
      return;
    }

    setIsCollapsed((prev) => !prev);
  }, [gameType, categories, onResult]);

  return (
    <BaseSurface className={cx('!p-0', className)} rounded='sm' {...moreProps}>
      <div
        className={cx(
          'flex h-auto w-full flex-col items-start justify-between gap-2.5 rounded-md px-4 py-2.5 sm:flex-row sm:items-center sm:gap-5',
          (gameType !== ActivityCategoryType.Stage || onResult) &&
            'transition-all hover:cursor-pointer hover:!border-primary-hue-teal-focus hover:shadow-md hover:ring-1 hover:ring-primary-hue-teal-focus',
        )}
        onClick={handleClick}
      >
        <div className='flex items-center gap-x-2.5'>
          {gameType !== ActivityCategoryType.Stage ? (
            <BaseIcon
              className='text-primary'
              name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
              size={22}
            />
          ) : (
            <BaseIcon className='text-accent/20' name='caret-right' size={22} />
          )}
          <BaseIcon
            className={cx(
              status === ActivityStatus.Completed
                ? 'text-green-500'
                : 'text-accent/40',
            )}
            name={
              status === ActivityStatus.Pending ? 'x-circle' : 'check-circle'
            }
            size={28}
            weight='bold'
          />
          <div className='flex flex-col gap-0.5'>
            <span className='pl-1'>
              Activity {orderNumber} - {title}
            </span>
            <BaseChip className='text-xs' iconName='dice-three'>
              {gameName}
            </BaseChip>
          </div>
        </div>
        <div className='flex w-full items-center justify-center gap-x-4 text-primary-hue-teal group-hover:text-white sm:w-auto sm:justify-start'>
          <div className='flex flex-col gap-x-4 sm:flex-row'>
            <div className='w-24 text-center text-lg font-medium'>
              {scoreText}
            </div>
            <BaseTag className='w-24 !bg-primary-hue-teal !px-2'>
              {statusText}
            </BaseTag>
          </div>
          <div className='flex min-w-[104px] items-center justify-end gap-x-2.5'>
            <span className='text-2xl font-bold'>{rankText}</span>
            {rank != null && rank <= 10 && (
              <PerformanceRankAwardImg rank={rank} size='sm' />
            )}
          </div>
        </div>
      </div>
      {gameType !== ActivityCategoryType.Stage && !isCollapsed && (
        <CategoryList
          isPointType={gameType === ActivityCategoryType.Point}
          categories={categories}
          onResult={onResult}
        />
      )}
    </BaseSurface>
  );
});

export const StudentActivityPerformanceSingleCardSkeleton = memo(function () {
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
