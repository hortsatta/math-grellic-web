import { useState, useMemo, useCallback } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useSchoolYearEdit } from '../hooks/use-school-year-edit.hook';
import { SchoolYearUpsertForm } from '../components/school-year-upsert-form.component';

const SCHOOL_YEAR_LIST_PATH = `/${adminBaseRoute}/${adminRoutes.schoolYear.to}`;

function SchoolYearEditPage() {
  const { slug } = useParams();

  const {
    loading,
    isDone,
    setIsDone,
    schoolYearFormData,
    editSchoolYear,
    deleteSchoolYear,
  } = useSchoolYearEdit(slug);

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const deleteMessage = useMemo(
    () => `Delete school year ${schoolYearFormData?.title}?`,
    [schoolYearFormData],
  );

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteSchoolYear = useCallback(async () => {
    if (!slug || !schoolYearFormData) {
      return;
    }

    try {
      await deleteSchoolYear();
      toast.success(`Deleted school year ${schoolYearFormData.title}`);
      navigate(SCHOOL_YEAR_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [slug, schoolYearFormData, deleteSchoolYear, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <SchoolYearUpsertForm
          loading={loading}
          isDone={isDone}
          formData={schoolYearFormData}
          onDone={setIsDone}
          onSubmit={editSchoolYear}
          onDelete={handleSetModal(true)}
        />
      </BaseDataSuspense>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <BaseIcon name='trash' size={28} />
            <span>{deleteMessage}</span>
          </div>
          <BaseButton
            className='!w-full'
            loading={loading}
            onClick={handleDeleteSchoolYear}
          >
            Delete Lesson
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}

export default SchoolYearEditPage;
