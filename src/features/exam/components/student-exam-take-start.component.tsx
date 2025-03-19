import { memo, useMemo } from 'react';
import cx from 'classix';

import { stripHtml } from '#/utils/html.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';
import { LessonItem } from '#/lesson/components/lesson-picker-list.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '#/lesson/models/lesson.model';

type Props = ComponentProps<'div'> & {
  onStart: () => void;
  description?: string;
  coveredLessons?: Partial<Lesson>[];
};

export const StudentExamTakeStart = memo(function ({
  className,
  description = '',
  coveredLessons,
  onStart,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => {
    const result = stripHtml(description);
    return !result.trim().length;
  }, [description]);

  return (
    <div
      className={cx('flex w-full flex-col items-center gap-y-8 p-4', className)}
      {...moreProps}
    >
      <BaseSurface className='w-full bg-white px-4' rounded='sm'>
        <span className='mb-4 block font-medium'>Covered Lessons</span>
        {coveredLessons?.length ? (
          <div className='flex flex-col'>
            {coveredLessons?.map((lesson) => (
              <LessonItem key={`li-${lesson.id}`} lesson={lesson as Lesson} />
            ))}
          </div>
        ) : (
          <div className='flex w-full justify-center'>None</div>
        )}
      </BaseSurface>
      {!isEmpty && (
        <div className='w-full'>
          <BaseDivider />
          <div className='base-rich-text rt-output py-5'>
            <BaseRichTextOutput
              className='border-0 p-0'
              label='Description'
              text={description}
              unboxed
            />
          </div>
          <BaseDivider />
        </div>
      )}
      <BaseButton rightIconName='play' onClick={onStart}>
        Start Exam
      </BaseButton>
    </div>
  );
});
