import { memo, useCallback } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseSearchInput } from '#/base/components/base-search-input.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { UserSingleItem } from './user-single-item.component';

import type { ComponentProps } from 'react';
import type { TeacherUserAccount } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  teachers: TeacherUserAccount[];
  selectedTeacherIds?: number[];
  onSearchChange: (value: string | null) => void;
  onTeacherSelect: (id: number) => () => void;
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
};

export const TeacherUserPickerList = memo(function ({
  className,
  loading,
  teachers,
  selectedTeacherIds,
  onSearchChange,
  onTeacherSelect,
  onCancel,
  onSubmit,
  ...moreProps
}: Props) {
  // Set active props for each teacher item
  const setItemSelected = useCallback(
    (targetId: number) => !!selectedTeacherIds?.find((id) => id === targetId),
    [selectedTeacherIds],
  );

  return (
    <div
      className={cx('flex flex-col items-center justify-between', className)}
      {...moreProps}
    >
      <div className='w-full overflow-hidden'>
        <div className='px-4'>
          <BaseSearchInput
            placeholder='Find a teacher'
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
              {(teachers as TeacherUserAccount[]).map((teacher) => (
                <li
                  key={teacher.id}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <UserSingleItem
                    userAccount={teacher}
                    selected={setItemSelected(teacher.id)}
                    onClick={onTeacherSelect(teacher.id)}
                  />
                </li>
              ))}
            </ul>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      <div className='flex w-full items-center justify-between gap-4 px-5 pt-2.5 xs:px-0'>
        <BaseButton variant='link' onClick={onCancel}>
          Cancel
        </BaseButton>
        <BaseButton onClick={onSubmit}>Select Teachers</BaseButton>
      </div>
    </div>
  );
});
