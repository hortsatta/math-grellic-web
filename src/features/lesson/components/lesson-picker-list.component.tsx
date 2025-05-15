import { memo, useCallback } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseSearchInput } from '#/base/components/base-search-input.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { LessonSingleItem } from './lesson-single-item.component';

import type { ComponentProps } from 'react';
import type { Lesson } from '../models/lesson.model';

type Props = ComponentProps<'div'> & {
  lessons: Lesson[];
  selectedLessonIds?: number[];
  onSearchChange: (value: string | null) => void;
  loading?: boolean;
  onLessonSelect?: (id: number) => () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
};

export const LessonPickerList = memo(function ({
  className,
  loading,
  lessons,
  selectedLessonIds,
  onSearchChange,
  onLessonSelect,
  onCancel,
  onSubmit,
  ...moreProps
}: Props) {
  // Set active props for each lesson item
  const setItemSelected = useCallback(
    (targetId: number) => !!selectedLessonIds?.find((id) => id === targetId),
    [selectedLessonIds],
  );

  return (
    <div
      className={cx('flex flex-col items-center justify-between', className)}
      {...moreProps}
    >
      <div className='w-full overflow-hidden p-1'>
        <div className='px-4'>
          <BaseSearchInput
            placeholder='Find a lesson'
            onChange={onSearchChange}
            fullWidth
          />
        </div>
        <div className='relative h-[450px] w-full'>
          {loading && (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          )}
          <OverlayScrollbarsComponent
            className='my-2 h-[450px] w-full px-4'
            defer
          >
            <ul className={cx('w-full', loading && 'opacity-50')}>
              {(lessons as Lesson[]).map((lesson) => (
                <li
                  key={lesson.id}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <LessonSingleItem
                    lesson={lesson}
                    selected={setItemSelected(lesson.id)}
                    {...(onLessonSelect && {
                      onClick: onLessonSelect(lesson.id),
                    })}
                  />
                </li>
              ))}
            </ul>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      {(!!onCancel || !!onSubmit) && (
        <div className='flex w-full items-center justify-between gap-4 px-5 pt-2.5 xs:px-0'>
          <BaseButton variant='link' onClick={onCancel}>
            Cancel
          </BaseButton>
          <BaseButton onClick={onSubmit}>Select Lessons</BaseButton>
        </div>
      )}
    </div>
  );
});
