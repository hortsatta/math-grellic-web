import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import {
  StudentLessonPerformanceSingleCardSkeleton,
  StudentLessonPerformanceSingleCard,
} from './student-lesson-performance-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
  loading?: boolean;
};

export const StudentLessonPerformanceList = memo(function ({
  className,
  loading,
  lessons,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const isEmpty = useMemo(() => !lessons?.length, [lessons]);

  const handleClick = useCallback(
    (slug: string) => () =>
      navigate(`/${studentBaseRoute}/${studentRoutes.lesson.to}/${slug}`),
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
        <div className='w-full py-4 text-center'>No lessons to show</div>
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
