import { memo } from 'react';
import cx from 'classix';

import { TeacherExamSingleCard } from '#/exam/components/teacher-exam-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';

type Props = ComponentProps<'div'> & {
  exams: Exam[];
};

export const GlobalSearchExamResultsList = memo(function ({
  className,
  exams,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {exams.map((exam) => (
        <TeacherExamSingleCard
          key={exam.id}
          exam={exam}
          // onPreview={handleExamPreview(exam.slug)}
          // onDetails={handleExamDetails(exam.slug)}
          // onEdit={handleExamEdit(exam.slug)}
          // onSchedule={handleExamSchedule(exam.slug)}
          role='row'
        />
      ))}
    </div>
  );
});
