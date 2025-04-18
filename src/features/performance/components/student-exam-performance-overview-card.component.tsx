import { memo, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseProgressCircle } from '#/base/components/base-progress-circle.component';
import { StudentPerformanceType } from '../models/performance.model';
import { PerformanceRankAwardImg } from './performance-rank-award-img.component';

import type { ComponentProps } from 'react';
import type { StudentPerformance } from '../models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  student: StudentPerformance;
  detailsTo?: string;
  compact?: boolean;
};

const EXAM_WRAPPER_CLASSNAME = 'flex flex-col items-center -3xs:w-36 w-auto';
const EXAM_WRAPPER_SM_CLASSNAME = 'flex flex-col items-center -3xs:w-24 w-auto';
const EXAM_VALUE_CLASSNAME = 'text-2xl font-bold text-primary-hue-purple';

export const StudentExamPerformanceOverviewCard = memo(function ({
  className,
  student,
  detailsTo,
  compact,
  ...moreProps
}: Props) {
  const [
    examCurrentCount,
    examTotalCount,
    examCompletedCount,
    examPassedCount,
    examFailedCount,
    examExpiredCount,
    overallExamCompletionPercent,
    overallExamScore,
    overallExamRank,
  ] = useMemo(
    () => [
      // Exams
      student.examCurrentCount,
      student.examTotalCount,
      student.examCompletedCount,
      student.examPassedCount,
      student.examFailedCount,
      student.examExpiredCount,
      student.overallExamCompletionPercent,
      student.overallExamScore,
      student.overallExamRank,
    ],
    [student],
  );

  const overallExamRankText = useMemo(
    () =>
      overallExamRank == null ? '-' : generateOrdinalSuffix(overallExamRank),
    [overallExamRank],
  );

  const overallExamScoreText = useMemo(() => {
    if (overallExamScore == null) {
      return '';
    }

    const pointText = overallExamScore > 1 ? 'Points' : 'Point';

    return `${overallExamScore} ${pointText}`;
  }, [overallExamScore]);

  return (
    <BaseSurface
      className={cx('flex flex-col gap-2.5', className)}
      rounded='sm'
      {...moreProps}
    >
      {!compact && (
        <div className='flex items-center justify-between'>
          <h3 className='text-base '>Exams</h3>
          {detailsTo && (
            <BaseLink to={detailsTo} rightIconName='subtract-square' size='xs'>
              More Details
            </BaseLink>
          )}
        </div>
      )}
      <div className='flex min-h-[200px] w-full flex-col items-center gap-5 md:flex-row md:items-stretch'>
        <div className='flex flex-1 flex-col items-center justify-center gap-y-8 '>
          <div className='flex items-center justify-center gap-5 font-bold text-primary-hue-purple'>
            <div className='flex items-center gap-x-2.5'>
              <span className='text-4xl'>{overallExamRankText}</span>
              {overallExamRank != null && overallExamRank <= 10 && (
                <PerformanceRankAwardImg rank={overallExamRank} />
              )}
            </div>
            {!!overallExamScore && (
              <>
                <BaseDivider className='!h-10' vertical />
                <span className='font-display text-2xl tracking-tighter'>
                  {overallExamScoreText}
                </span>
              </>
            )}
          </div>
          <BaseProgressCircle
            percent={overallExamCompletionPercent}
            performance={StudentPerformanceType.Exam}
            label='Overall Completion'
          />
        </div>
        <BaseDivider className='hidden !h-auto md:block' vertical />
        <BaseDivider className='block md:hidden' />
        <div className='flex flex-1 flex-col items-center justify-center gap-2.5 font-medium'>
          <div className='flex w-full flex-col items-center gap-2.5 rounded-lg border p-4'>
            <div className={EXAM_WRAPPER_CLASSNAME}>
              <span className={EXAM_VALUE_CLASSNAME}>{examCompletedCount}</span>
              <span>Exams Completed</span>
            </div>
            <BaseDivider />
            <div className='flex items-center justify-center gap-2.5'>
              <div className={EXAM_WRAPPER_SM_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>{examPassedCount}</span>
                <span className='text-sm'>Passed</span>
              </div>
              <BaseDivider className='!h-14' vertical />
              <div className={EXAM_WRAPPER_SM_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>{examFailedCount}</span>
                <span className='text-sm'>Failed</span>
              </div>
              <BaseDivider className='!h-14' vertical />
              <div className={EXAM_WRAPPER_SM_CLASSNAME}>
                <span className={EXAM_VALUE_CLASSNAME}>{examExpiredCount}</span>
                <span className='text-sm'>Expired</span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2.5'>
            <div className={EXAM_WRAPPER_CLASSNAME}>
              <span className={EXAM_VALUE_CLASSNAME}>{examCurrentCount}</span>
              <span>Current Exams</span>
            </div>
            <div className={EXAM_WRAPPER_CLASSNAME}>
              <span className={EXAM_VALUE_CLASSNAME}>{examTotalCount}</span>
              <span>Total Exams</span>
            </div>
          </div>
        </div>
      </div>
    </BaseSurface>
  );
});
