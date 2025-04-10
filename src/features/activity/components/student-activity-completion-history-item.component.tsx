import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseChip } from '#/base/components/base-chip.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseTag } from '#/base/components/base-tag.component';
import { ActivityCategoryLevel } from '../models/activity.model';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityCategory } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  category: ActivityCategory;
  isPointType: boolean;
};

const labelIconNames = [
  'number-square-one',
  'number-square-two',
  'number-square-three',
];

export const StudentActivityCompletionHistoryItem = memo(function ({
  className,
  category,
  isPointType,
  onClick,
  ...moreProps
}: Props) {
  const [score, scoreText, label, labelIconName] = useMemo(() => {
    const label = ActivityCategoryLevel[category.level];
    const labelIconName = labelIconNames[category.level - 1];
    const completion = category.completions?.length
      ? category.completions[0]
      : null;

    if (!completion) {
      return [null, '-', label, labelIconName];
    }

    const score =
      (isPointType ? completion.score : completion.timeCompletedSeconds) || 0;

    const scoreText = isPointType
      ? `${score} ${score > 1 ? 'Pts' : 'Pt'}`
      : `${score} ${score > 1 ? 'Secs' : 'Sec'}`;

    return [score, scoreText, label, labelIconName];
  }, [isPointType, category]);

  return (
    <div
      className={cx(
        'flex w-full flex-col gap-2.5 rounded-md -3xs:flex-row -3xs:items-center -3xs:justify-between',
        onClick &&
          'cursor-pointer transition-all hover:!border-primary-hue-teal-focus hover:shadow-md hover:ring-1 hover:ring-primary-hue-teal-focus',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2.5'>
        <BaseIcon
          className={cx(score != null ? 'text-green-500' : 'text-accent/40')}
          name={score != null ? 'check-circle' : 'x-circle'}
          size={28}
          weight='bold'
        />
        <BaseChip
          className='w-28'
          iconName={labelIconName as IconName}
          isCompact
        >
          {label}
        </BaseChip>
      </div>
      <div className='flex items-center gap-2.5'>
        <BaseTag className='w-24 !bg-primary-hue-teal !px-2'>
          {score != null ? 'Completed' : 'Pending'}
        </BaseTag>
        <span className='w-24 text-right text-lg font-medium text-primary-hue-teal'>
          {scoreText}
        </span>
      </div>
    </div>
  );
});
