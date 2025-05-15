import { memo, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { BaseItemCounterButton } from '#/base/components/base-item-counter-button.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getStudentsByCurrentAdmin } from '#/user/api/admin-user.api';

import type { ComponentProps } from 'react';
import { transformToStudentUserAccount } from '#/user/helpers/user-transform.helper';
import { SchoolYearEnrollmentApprovalStatus } from '../models/school-year-enrollment.model';
import { StudentUserPickerList } from '#/user/components/student-user-picker-list.component';

type Props = ComponentProps<'div'> & {
  studentCount: number;
  teacherId: number;
  schoolYearId?: number;
  loading?: boolean;
};

export const StudentSchoolYearEnrollmentCounterList = memo(function ({
  loading,
  studentCount,
  teacherId,
  schoolYearId,
  ...moreProps
}: Props) {
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: students,
    isLoading: isStudentLoading,
    isFetching: isStudentFetching,
    refetch,
  } = useQuery(
    getStudentsByCurrentAdmin(
      {
        q: keyword,
        teacherId,
        schoolYearId,
        enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Approved,
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!keyword,
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToStudentUserAccount(item))
            : undefined,
      },
    ),
  );

  const totalStudentCountText = useMemo(() => {
    if (!studentCount) {
      return 'No students enrolled';
    }

    return `${studentCount > 1 ? 'Students' : 'Student'} enrolled`;
  }, [studentCount]);

  const toggleModal = useCallback(
    (open: boolean) => () => setOpenModal(open),
    [],
  );

  const handleButtonClick = useCallback(() => {
    if (students == null) refetch();
    toggleModal(true)();
  }, [students, toggleModal, refetch]);

  const handleSearchChange = useCallback((value: string | null) => {
    setKeyword(value || undefined);
  }, []);

  return (
    <>
      <div {...moreProps}>
        {loading ? (
          <div className='flex h-[86px] w-[147px] items-center justify-center'>
            <BaseSpinner size='sm' />
          </div>
        ) : (
          <BaseItemCounterButton
            countClassName='text-primary'
            count={studentCount}
            countLabel={totalStudentCountText}
            iconName='graduation-cap'
            onClick={handleButtonClick}
          />
        )}
      </div>
      <BaseModal open={openModal} onClose={toggleModal(false)}>
        <StudentUserPickerList
          students={students || []}
          loading={isStudentLoading || isStudentFetching}
          onSearchChange={handleSearchChange}
        />
      </BaseModal>
    </>
  );
});
