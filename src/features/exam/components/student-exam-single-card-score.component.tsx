import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseTag } from '#/base/components/base-tag.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';

import examPaperPng from '#/assets/images/exam-paper.png';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  score: number | null;
  hasPassed: boolean;
  hasMultipleSchedules: boolean;
  isUpcoming: boolean;
  isOngoing: boolean;
};

export const StudentExamSingleCardScore = memo(function ({
  className,
  score,
  hasPassed,
  hasMultipleSchedules,
  isUpcoming,
  isOngoing,
  ...moreProps
}: Props) {
  const tooltipContent = useMemo(
    () =>
      hasMultipleSchedules
        ? 'Exam has been taken more than once, the highest score is recorded'
        : '',
    [hasMultipleSchedules],
  );

  return (
    <BaseTooltip content={tooltipContent} placement='right-start'>
      <div
        className={cx(
          'flex h-[133px] w-full items-center justify-center overflow-hidden rounded-md border border-primary-hue-purple-dark bg-primary-hue-purple-dark sm:w-[100px]',
          className,
        )}
        {...moreProps}
      >
        {isUpcoming || (isOngoing && score == null) ? (
          <img src={examPaperPng} alt='exam paper' width={89} height={122} />
        ) : (
          <div className='relative flex h-full w-full flex-1 flex-col justify-start text-white'>
            {hasMultipleSchedules && (
              <div className='flex justify-end bg-primary-hue-purple-focus px-1 pt-1'>
                <BaseTag className='border border-primary-hue-purple-dark !bg-primary-hue-purple !px-1.5 !py-0.5 !text-[10px]'>
                  Highest
                </BaseTag>
              </div>
            )}
            {score == null ? (
              <>
                <div className='flex h-full flex-1 items-center justify-center bg-primary-hue-purple-focus text-6xl font-medium'>
                  -
                </div>
                <small className='py-1 text-center font-medium uppercase'>
                  Expired
                </small>
              </>
            ) : (
              <>
                <div className='flex h-full flex-1 items-center justify-center bg-primary-hue-purple-focus text-6xl font-medium'>
                  {score}
                </div>
                <small className='py-1 text-center font-medium uppercase'>
                  {hasPassed ? 'Passed' : 'Failed'}
                </small>
              </>
            )}
          </div>
        )}
      </div>
    </BaseTooltip>
  );
});
