import { memo, useMemo } from 'react';
import cx from 'classix';

import { studentExamBaseRoute } from '#/exam/route/student-exam-handle.route';
import { BaseLink } from '#/base/components/base-link.component';
import { StudentExamSingleCard } from '#/exam/components/student-exam-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';
import type { StudentSearchResults } from '../models/global-search.model';

type Props = ComponentProps<'div'> & {
  exams: NonNullable<StudentSearchResults['exams']>;
};

export const StudentGlobalSearchExamList = memo(function ({
  className,
  exams,
  ...moreProps
}: Props) {
  const filteredExams = useMemo(
    () =>
      [exams.upcomingExam, ...exams.ongoingExams, ...exams.moreExams].filter(
        (exam) => exam != null,
      ) as Exam[],
    [exams],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg leading-none'>Exams</h3>
        <BaseLink
          to={studentExamBaseRoute}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Exams
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5' role='table'>
        {!!filteredExams.length &&
          filteredExams.map((exam) => (
            <StudentExamSingleCard
              key={`exam-${exam.orderNumber}`}
              exam={exam}
            />
          ))}
      </div>
    </div>
  );
});
