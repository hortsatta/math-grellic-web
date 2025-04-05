import { memo, useMemo } from 'react';

import cx from 'classix';
import {
  StudentExamPerformanceSingleCard,
  StudentExamPerformanceSingleCardSkeleton,
} from './student-exam-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';

type Props = ComponentProps<'div'> & {
  exams: Exam[];
  loading?: boolean;
};

export const StudentExamPerformanceList = memo(function ({
  className,
  loading,
  exams,
  ...moreProps
}: Props) {
  const filteredExams = useMemo(
    () => exams?.filter((exams) => exams.schedules?.length),
    [exams],
  );

  const isEmpty = useMemo(() => !filteredExams?.length, [filteredExams]);

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {loading ? (
        [...Array(4)].map((_, index) => (
          <StudentExamPerformanceSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <div className='w-full py-4 text-center'>No exams to show</div>
      ) : (
        filteredExams.map((exam) => (
          <StudentExamPerformanceSingleCard
            key={`exam-${exam.id}`}
            exam={exam}
            role='row'
          />
        ))
      )}
    </div>
  );
});
