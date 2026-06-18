import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { TeacherExamSingleCard } from '#/exam/components/teacher-exam-single-card.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';

type Props = ComponentProps<'div'> & {
  exams: Exam[];
};

const EXAM_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.exam.to}`;

export const TeacherGlobalSearchExamList = memo(function ({
  className,
  exams,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const handleExamPreview = useCallback(
    (slug: string) => () => {
      window
        .open(
          `${EXAM_LIST_PATH}/${slug}/${teacherRoutes.exam.previewTo}`,
          '_blank',
        )
        ?.focus();
    },
    [],
  );

  const handleExamDetails = useCallback(
    (slug: string) => () => {
      navigate(`${EXAM_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleExamEdit = useCallback(
    (slug: string) => () => {
      navigate(`${EXAM_LIST_PATH}/${slug}/${teacherRoutes.exam.editTo}`);
    },
    [navigate],
  );

  const handleExamSchedule = useCallback(
    (slug: string) => () => {
      navigate(`${EXAM_LIST_PATH}/${slug}/${teacherRoutes.exam.schedule.to}`);
    },
    [navigate],
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
          to={EXAM_LIST_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Exams
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5'>
        {exams.map((exam) => (
          <TeacherExamSingleCard
            key={exam.id}
            exam={exam}
            onPreview={handleExamPreview(exam.slug)}
            onDetails={handleExamDetails(exam.slug)}
            onEdit={handleExamEdit(exam.slug)}
            onSchedule={handleExamSchedule(exam.slug)}
            role='row'
          />
        ))}
      </div>
    </div>
  );
});
