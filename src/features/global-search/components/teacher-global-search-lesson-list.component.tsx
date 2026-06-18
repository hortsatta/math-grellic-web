import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseLink } from '#/base/components/base-link.component';
import { TeacherLessonSingleCard } from '#/lesson/components/teacher-lesson-single-card.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
};

const LESSON_LIST_PATH = `/${teacherBaseRoute}/${teacherRoutes.lesson.to}`;

export const TeacherGlobalSearchLessonList = memo(function ({
  className,
  lessons,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const handleLessonPreview = useCallback(
    (slug: string) => () => {
      window
        .open(
          `${LESSON_LIST_PATH}/${slug}/${teacherRoutes.lesson.previewTo}`,
          '_blank',
        )
        ?.focus();
    },
    [],
  );

  const handleLessonDetails = useCallback(
    (slug: string) => () => {
      navigate(`${LESSON_LIST_PATH}/${slug}`);
    },
    [navigate],
  );

  const handleLessonEdit = useCallback(
    (slug: string) => () => {
      navigate(`${LESSON_LIST_PATH}/${slug}/${teacherRoutes.lesson.editTo}`);
    },
    [navigate],
  );

  const handleLessonSchedule = useCallback(
    (slug: string) => () => {
      navigate(
        `${LESSON_LIST_PATH}/${slug}/${teacherRoutes.lesson.schedule.to}`,
      );
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
        <h3 className='text-lg leading-none'>Lessons</h3>
        <BaseLink
          to={LESSON_LIST_PATH}
          rightIconName='arrow-circle-right'
          size='xs'
        >
          View All Lessons
        </BaseLink>
      </div>
      <div className='flex flex-col gap-2.5'>
        {lessons.map((lesson) => (
          <TeacherLessonSingleCard
            key={lesson.id}
            lesson={lesson}
            onPreview={handleLessonPreview(lesson.slug)}
            onDetails={handleLessonDetails(lesson.slug)}
            onEdit={handleLessonEdit(lesson.slug)}
            onSchedule={handleLessonSchedule(lesson.slug)}
            role='row'
          />
        ))}
      </div>
    </div>
  );
});
