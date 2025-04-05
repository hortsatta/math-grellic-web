import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  StudentLessonPerformanceSingleCard,
  StudentLessonPerformanceSingleCardSkeleton,
} from './student-lesson-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

const LESSON_CREATE_TO = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${teacherRoutes.exam.createTo}`;

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
  loading?: boolean;
};

export const TeacherStudentLessonPerformanceList = memo(function ({
  className,
  loading,
  lessons,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const isEmpty = useMemo(() => !lessons?.length, [lessons]);

  const handleClick = useCallback(
    (slug: string) => () =>
      navigate(`/${teacherBaseRoute}/${teacherRoutes.lesson.to}/${slug}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
      {loading ? (
        [...Array(4)].map((_, index) => (
          <StudentLessonPerformanceSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No lessons available'
          linkTo={LESSON_CREATE_TO}
        />
      ) : (
        lessons.map((lesson) => (
          <StudentLessonPerformanceSingleCard
            key={`lesson-${lesson.id}`}
            lesson={lesson}
            role='row'
            onClick={handleClick(lesson.slug)}
          />
        ))
      )}
    </div>
  );
});
