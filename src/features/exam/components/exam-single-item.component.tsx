import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<'button'> & {
  exam: Exam;
  onClick?: () => void;
};

const chipProps = { className: 'text-xs', iconProps: { size: 16 } };

export const ExamSingleItem = memo(function ({
  className,
  exam,
  onClick,
  ...moreProps
}: Props) {
  const [title, orderNumber, passingPoints, totalPoints, randomizeQuestions] =
    useMemo(
      () => [
        exam.title,
        `No. ${exam.orderNumber}`,
        exam.passingPoints,
        exam.pointsPerQuestion * exam.visibleQuestionsCount,
        exam.randomizeQuestions,
      ],
      [exam],
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
          <BaseIcon name='exam' className='opacity-60' size={36} />
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
            <BaseChip iconName='list-numbers' {...chipProps}>
              {passingPoints} Passing
            </BaseChip>
            <BaseDivider className='hidden !h-4 -3xs:block' vertical />
            <BaseChip iconName='list-checks' {...chipProps}>
              {totalPoints} Total
            </BaseChip>
            {randomizeQuestions && (
              <>
                <BaseDivider className='hidden !h-4 -3xs:block' vertical />
                <BaseChip iconName='check-square' {...chipProps}>
                  Randomized
                </BaseChip>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
});
