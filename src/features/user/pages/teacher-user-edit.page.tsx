import { useCallback, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { useTeacherUserEdit } from '../hooks/use-teacher-user-edit.hook';
import { TeacherUserUpsertForm } from '../components/teacher-user-upsert-form.component';

const TEACHER_LIST_PATH = `/${adminBaseRoute}/${adminRoutes.teacher.to}`;

function TeacherUserEditPage() {
  const { id } = useParams();

  const {
    loading,
    isDone,
    setIsDone,
    teacherFormData,
    editTeacher,
    deleteTeacher,
  } = useTeacherUserEdit(+(id || 0));

  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  const handleDeleteTeacher = useCallback(async () => {
    if (!id || !teacherFormData) {
      return;
    }

    try {
      await deleteTeacher();
      toast.success(`Teacher deleted`);
      navigate(TEACHER_LIST_PATH);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [id, teacherFormData, deleteTeacher, navigate]);

  return (
    <>
      <BaseDataSuspense resolve={data?.main}>
        <TeacherUserUpsertForm
          loading={loading}
          isDone={isDone}
          formData={teacherFormData}
          onDone={setIsDone}
          onSubmit={editTeacher}
          onDelete={handleSetModal(true)}
        />
      </BaseDataSuspense>
      <BaseModal size='xs' open={openModal} onClose={handleSetModal(false)}>
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <BaseIcon name='trash' size={28} />
            <span>Delete teacher?</span>
          </div>
          <BaseButton
            className='!w-full'
            loading={loading}
            onClick={handleDeleteTeacher}
          >
            Delete Teacher
          </BaseButton>
        </div>
      </BaseModal>
    </>
  );
}

export default TeacherUserEditPage;
