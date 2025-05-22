import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseMultiProgressCircle } from '#/base/components/base-multi-progress-circle.component';

import type { ComponentProps } from 'react';
import type { TeacherStudentSchoolYearAcademicProgress } from '../models/school-year.model';

type Props = ComponentProps<'div'> & {
  studentsAcademicProgress: TeacherStudentSchoolYearAcademicProgress;
};

const PERCENT_TEXT_WRAPPER_CLASSNAME = 'flex items-center gap-1.5';
const PERCENT_VALUE_TEXT_CLASSNAME = 'text-base font-bold';
const PERCENT_TEXT_CLASSNAME = 'w-[150px]';

export const TeacherStudentSchoolYearAcademicProgressSummary = memo(function ({
  className,
  studentsAcademicProgress,
  ...moreProps
}: Props) {
  const [passedPercent, failedPercent, ongoingPercent, totalStudentCount] =
    useMemo(
      () => [
        studentsAcademicProgress?.passedPercent || 0,
        studentsAcademicProgress?.failedPercent || 0,
        studentsAcademicProgress?.ongoingPercent || 0,
        studentsAcademicProgress?.totalStudentCount || 0,
      ],
      [studentsAcademicProgress],
    );

  const progressItems = useMemo(
    () =>
      [
        { percent: passedPercent, className: 'stroke-green-500' },
        { percent: failedPercent, className: 'stroke-red-500' },
        { percent: ongoingPercent, className: 'stroke-primary' },
      ].filter((item) => item.percent > 0),
    [passedPercent, failedPercent, ongoingPercent],
  );

  return (
    <div
      className={cx('flex flex-col items-center -3xs:flex-row', className)}
      {...moreProps}
    >
      <div className='relative h-[104px] w-[104px]'>
        <BaseMultiProgressCircle items={progressItems} />
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary'>
          <BaseIcon name='flow-arrow' size={48} weight='bold' />
        </div>
      </div>
      <div className='flex flex-col items-center -3xs:flex-row'>
        <div className='h-4 w-0.5 bg-accent -3xs:h-0.5 -3xs:w-4' />
        <div className='flex flex-col items-end justify-center gap-1 overflow-hidden rounded-4px border-2 border-accent px-2.5 py-1 text-sm font-medium'>
          <div className={PERCENT_TEXT_WRAPPER_CLASSNAME}>
            <span className={PERCENT_VALUE_TEXT_CLASSNAME}>
              {passedPercent}%
            </span>
            <span className={PERCENT_TEXT_CLASSNAME}>Students Passed</span>
          </div>
          <div className={PERCENT_TEXT_WRAPPER_CLASSNAME}>
            <span className={PERCENT_VALUE_TEXT_CLASSNAME}>
              {failedPercent}%
            </span>
            <span className={PERCENT_TEXT_CLASSNAME}>Students Failed</span>
          </div>
          <div className={PERCENT_TEXT_WRAPPER_CLASSNAME}>
            <span className={PERCENT_VALUE_TEXT_CLASSNAME}>
              {ongoingPercent}%
            </span>
            <span className={PERCENT_TEXT_CLASSNAME}>Students in Progress</span>
          </div>
          <BaseDivider />
          <div className={PERCENT_TEXT_WRAPPER_CLASSNAME}>
            <span className={PERCENT_VALUE_TEXT_CLASSNAME}>
              {totalStudentCount}
            </span>
            <span className={PERCENT_TEXT_CLASSNAME}>
              Total Enrolled Students
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
