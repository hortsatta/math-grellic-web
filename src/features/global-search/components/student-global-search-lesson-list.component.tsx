import { memo, useMemo } from 'react';
import cx from 'classix';

import { studentLessonBaseRoute } from '#/lesson/route/student-lesson-handle.route';
import { BaseLink } from '#/base/components/base-link.component';
import { StudentLessonSingleCard } from '#/lesson/components/student-lesson-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';
import type { StudentSearchResults } from '../models/global-search.model';

type Props = ComponentProps<'div'> & {
  lessons: NonNullable<StudentSearchResults['lessons']>;
};

export const StudentGlobalSearchLessonList = memo(function ({
  className,
  lessons,
  ...moreProps
}: Props) {
  const filteredLessons = useMemo(
    () =>
      [lessons.upcomingLesson, ...lessons.moreLessons].filter(
        (lesson) => lesson != null,
      ) as Lesson[],
    [lessons],
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
        <h3 className='text-lg leading-none'>Lessons</h3>
        <BaseLink
          to={studentLessonBaseRoute}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Lessons
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5' role='table'>
        {!!filteredLessons.length &&
          filteredLessons.map((lesson) => (
            <StudentLessonSingleCard
              key={`lesson-${lesson.orderNumber}`}
              lesson={lesson}
            />
          ))}
      </div>
    </div>
  );
});
