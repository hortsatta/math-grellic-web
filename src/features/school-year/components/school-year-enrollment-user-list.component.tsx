import { memo, useCallback, useMemo, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSearchInput } from '#/base/components/base-search-input.component';
import { UserSingleItem } from '#/user/components/user-single-item.component';

import type {
  StudentUserAccount,
  TeacherUserAccount,
} from '#/user/models/user.model';

import type { ComponentProps } from 'react';
import {
  getStudentsByCurrentAdmin,
  getTeachersByCurrentAdminUser,
} from '#/user/api/admin-user.api';
import {
  transformToStudentUserAccount,
  transformToTeacherUserAccount,
} from '#/user/helpers/user-transform.helper';
import { useQuery } from '@tanstack/react-query';
import { SchoolYearEnrollmentApprovalStatus } from '../models/school-year-enrollment.model';

type Props = ComponentProps<'div'> & {
  schoolYearId?: number;
  isStudent?: boolean;
};

export const SchoolYearEnrollmentUserList = memo(function ({
  className,
  schoolYearId,
  isStudent,
  ...moreProps
}: Props) {
  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  const queryFn: any = useMemo(
    () =>
      isStudent ? getStudentsByCurrentAdmin : getTeachersByCurrentAdminUser,
    [isStudent],
  );

  const {
    data: userAccounts,
    isFetching,
    isLoading,
  } = useQuery(
    queryFn(
      {
        q: keyword,
        schoolYearId,
        enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Approved,
      },
      {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) =>
                isStudent
                  ? transformToStudentUserAccount(item)
                  : transformToTeacherUserAccount(item),
              )
            : [],
      },
    ),
  );

  const isEmpty = useMemo(
    () => !(userAccounts as any[])?.length,
    [userAccounts],
  );

  const searchPlaceholder = useMemo(
    () => `Find a ${isStudent ? 'student' : 'teacher'}`,
    [isStudent],
  );

  const handleSearchChange = useCallback((value: string | null) => {
    setKeyword(value || undefined);
  }, []);

  return (
    <div
      className={cx('flex flex-col items-center justify-between', className)}
      {...moreProps}
    >
      <div className='w-full overflow-hidden'>
        <div className='px-4'>
          <BaseSearchInput
            placeholder={searchPlaceholder}
            onChange={handleSearchChange}
            disabled={isEmpty}
            fullWidth
          />
        </div>
        <div className='relative h-[450px] w-full'>
          {(isFetching || isLoading) && (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          )}
          <OverlayScrollbarsComponent
            className='my-2 h-[450px] w-full px-4'
            defer
          >
            {!isEmpty ? (
              <ul
                className={cx(
                  'w-full',
                  (isFetching || isLoading) && 'opacity-50',
                )}
              >
                {(
                  userAccounts as StudentUserAccount[] | TeacherUserAccount[]
                ).map((userAccount) => (
                  <li
                    key={userAccount.id}
                    className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                  >
                    <UserSingleItem userAccount={userAccount} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className='py-4 text-center opacity-70'>
                <span>{`No ${
                  isStudent ? 'students' : 'teachers'
                } enrolled`}</span>
              </div>
            )}
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </div>
  );
});
