import { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import cx from 'classix';

import { queryUserKey } from '#/config/react-query-keys.config';
import { BaseSelect } from '#/base/components/base-select.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { transformToTeacherUserAccount } from '../helpers/user-transform.helper';
import { getTeachersByCurrentAdminUser } from '../api/admin-user.api';
import {
  TeacherUserItem,
  TeacherUserPickerList,
} from './teacher-user-picker-list.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { SelectOption } from '#/base/models/base.model';
import type { TeacherUserAccount } from '../models/user.model';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  name?: string;
  value?: number[] | null;
  label?: string;
  description?: string;
  errorMessage?: string;
  asterisk?: boolean;
  required?: boolean;
  selectProps?: Omit<ComponentProps<typeof BaseSelect>, 'options'>;
  onChange?: (value: number[] | null) => void;
};

const options: SelectOption[] = [
  {
    label: 'Everyone',
    value: '1',
  },
  {
    label: 'Select teachers...',
    value: '2',
  },
];

export const TeacherUserPicker = memo(
  forwardRef<HTMLDivElement, Props>(function (
    {
      name,
      value,
      label,
      className,
      description,
      errorMessage,
      asterisk,
      required,
      selectProps,
      onChange,
      ...moreProps
    },
    ref,
  ) {
    const [keyword, setKeyword] = useState<string | undefined>(undefined);

    const {
      data: teachers,
      isFetching,
      isLoading,
    } = useQuery(
      getTeachersByCurrentAdminUser(
        { q: keyword },
        {
          refetchOnWindowFocus: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToTeacherUserAccount(item))
              : [],
        },
      ),
    );

    const [openModal, setOpenModal] = useState(false);

    const [selectValue, setSelectValue] = useState<string | undefined>(
      undefined,
    );

    const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>(
      value || [],
    );

    const [modalSelectedTeacherIds, setModalSelectedTeacherIds] =
      useState<number[]>(selectedTeacherIds);

    const {
      data: selectedTeachers,
      isLoading: isSelectTeachersLoading,
      isFetching: isSelectTeachersFetching,
      refetch: selectedTeachersRefetch,
    } = useQuery(
      getTeachersByCurrentAdminUser(
        { ids: value || selectedTeacherIds || [] },
        {
          queryKey: queryUserKey.selectedTeacherList,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          enabled: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToTeacherUserAccount(item))
              : [],
        },
      ),
    );

    useEffect(() => {
      if (value == null) {
        return;
      }

      (async () => {
        await selectedTeachersRefetch();
      })();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, selectedTeacherIds]);

    useEffect(() => {
      if (value === undefined) {
        setSelectValue(undefined);
        return;
      }

      // Set current BaseSelect value, set to "Everyone" if value is null or empty array.
      // Else set to second option - "Specify"
      if (!value?.length) {
        setSelectValue(options[0].value.toString());
      } else {
        setSelectValue(options[1].value.toString());
      }
    }, [value]);

    const handleCloseModal = useCallback(() => setOpenModal(false), []);

    // Handle BaseSelect change selected option, open modal if "specify" option is selected.
    // And sync modalSelectedIds to main selectedTeacherIds value
    const handleSelectChange = useCallback(
      (val: string) => {
        setSelectValue(val);

        if (val !== '2') {
          setModalSelectedTeacherIds([]);
          setSelectedTeacherIds([]);
          onChange && onChange([]);
          return;
        }

        setModalSelectedTeacherIds(selectedTeacherIds);
        setOpenModal(true);
      },
      [selectedTeacherIds, onChange],
    );

    // Add or remove id from modalSelectedTeacherIds
    const handleTeacherSelect = useCallback(
      (id: number) => () =>
        setModalSelectedTeacherIds((prev) => {
          const isExisting = prev.some((item) => item === id);

          if (isExisting) {
            return prev.filter((item) => item !== id);
          }

          return [...prev, id];
        }),
      [],
    );

    const handleSearchChange = useCallback((value: string | null) => {
      setKeyword(value || undefined);
    }, []);

    // Cancel by syncing modalSelectedTeacherIds back to selectedTeacherIds,
    // then close modal
    const handleCancel = useCallback(() => {
      setModalSelectedTeacherIds(selectedTeacherIds);

      if (!selectedTeacherIds || !selectedTeacherIds.length) {
        setSelectValue('1');
      }

      handleCloseModal();
    }, [selectedTeacherIds, handleCloseModal]);

    // Apply modalSelectedTeacherIds to main selectedTeacherIds, then close modal
    const handleSubmit = useCallback(() => {
      setSelectedTeacherIds(modalSelectedTeacherIds);
      onChange && onChange(modalSelectedTeacherIds);

      if (!modalSelectedTeacherIds?.length) {
        setSelectValue('1');
      }

      handleCloseModal();
    }, [modalSelectedTeacherIds, handleCloseModal, onChange]);

    return (
      <div className={cx('w-full', className)} {...moreProps}>
        <BaseSelect
          ref={ref}
          className='!min-w-full'
          name={name}
          label={label}
          value={selectValue}
          options={options}
          onChange={handleSelectChange}
          description={description}
          errorMessage={errorMessage}
          asterisk={asterisk}
          required={required}
          {...selectProps}
        />
        {isSelectTeachersFetching || isSelectTeachersLoading ? (
          <div className='mt-5 flex w-full justify-center'>
            <BaseSpinner />
          </div>
        ) : (
          <ul
            className={cx('w-full', (isLoading || isFetching) && 'opacity-50')}
          >
            {value != null &&
              (selectedTeachers as TeacherUserAccount[]).map((teacher) => (
                <li
                  key={teacher.id}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <TeacherUserItem teacher={teacher} />
                </li>
              ))}
          </ul>
        )}
        <BaseModal
          className='!min-h-0 !border-0 !px-0 !pb-8 xs:!px-10'
          size='sm'
          open={openModal}
          onClose={handleCancel}
        >
          <TeacherUserPickerList
            teachers={teachers as TeacherUserAccount[]}
            selectedTeacherIds={modalSelectedTeacherIds}
            loading={isLoading || isFetching}
            onSearchChange={handleSearchChange}
            onTeacherSelect={handleTeacherSelect}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </BaseModal>
      </div>
    );
  }),
);

export function TeacherUserControlledPicker(
  props: Props & UseControllerProps<any>,
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <TeacherUserPicker {...props} {...field} errorMessage={error?.message} />
  );
}
