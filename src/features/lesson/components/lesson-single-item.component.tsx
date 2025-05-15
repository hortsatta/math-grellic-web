import { memo, useMemo } from 'react';
import cx from 'classix';

import { convertSecondsToDuration } from '#/utils/time.util';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'button'> & {
  lesson: Lesson;
  onClick?: () => void;
  selected?: boolean;
};

const chipProps = { className: 'text-xs', iconProps: { size: 16 } };

export const LessonSingleItem = memo(function ({
  className,
  lesson,
  selected,
  onClick,
  ...moreProps
}: Props) {
  const [title, orderNumber, duration] = useMemo(
    () => [
      lesson.title,
      `No. ${lesson.orderNumber}`,
      convertSecondsToDuration(lesson.durationSeconds || 0, true),
    ],
    [lesson],
  );

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
          <BaseIcon name='chalkboard' className='opacity-60' size={36} />
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
            <BaseChip iconName='hourglass' {...chipProps}>
              {duration}
            </BaseChip>
          </div>
        </div>
      </div>
      <div className='flex h-9 w-9 items-center justify-center'>
        {selected && (
          <BaseIcon
            name='check-fat'
            className='text-green-500'
            size={28}
            weight='fill'
          />
        )}
      </div>
    </button>
  );
});
