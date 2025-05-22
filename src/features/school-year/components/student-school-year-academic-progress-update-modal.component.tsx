import { memo, useCallback } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { useStudentSchoolYearAcademicProgressUpdate } from '../hooks/use-student-school-year-academic-progress-update.hook';
import { StudentSchoolYearAcademicProgressUpdateForm } from './student-school-year-academic-progress-update-form.component';

import type { ComponentProps } from 'react';
import type { SchoolYearEnrollmentAcademicProgressFormData } from '../models/school-year-enrollment-form-data.model';

type Props = ComponentProps<typeof BaseModal> & {
  publicId?: string;
};

export const StudentSchoolYearAcademicProgressUpdateModal = memo(function ({
  publicId,
  onClose,
  ...moreProps
}: Props) {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    loading,
    academicProgressUpdateLoading,
    apFormData,
    setStudentAcademicProgress,
  } = useStudentSchoolYearAcademicProgressUpdate(publicId, schoolYear?.id);

  const handleClose = useCallback(() => {
    if (academicProgressUpdateLoading) return;
    onClose && onClose();
  }, [academicProgressUpdateLoading, onClose]);

  const handleSubmit = useCallback(
    async (data: Partial<SchoolYearEnrollmentAcademicProgressFormData>) => {
      const result = await setStudentAcademicProgress(data);
      handleClose();
      return result;
    },
    [handleClose, setStudentAcademicProgress],
  );

  return (
    <BaseModal size='sm' onClose={handleClose} {...moreProps}>
      {loading ? (
        <div className='flex h-[86px] items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        apFormData &&
        schoolYear && (
          <StudentSchoolYearAcademicProgressUpdateForm
            className='mx-auto min-h-[480px] justify-between pb-4'
            loading={academicProgressUpdateLoading}
            schoolYear={schoolYear}
            formData={apFormData}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        )
      )}
    </BaseModal>
  );
});
