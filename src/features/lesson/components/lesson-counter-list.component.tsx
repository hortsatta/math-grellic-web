import { memo, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { RecordStatus } from '#/core/models/core.model';
import { BaseItemCounterButton } from '#/base/components/base-item-counter-button.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { transformToLesson } from '../helpers/lesson-transform.helper';
import { getLessonsByTeacherId } from '../api/admin-lesson.api';
import { LessonPickerList } from './lesson-picker-list.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  lessonCount: number;
  teacherId: number;
  schoolYearId?: number;
  loading?: boolean;
};

export const LessonCounterList = memo(function ({
  loading,
  lessonCount,
  teacherId,
  schoolYearId,
  ...moreProps
}: Props) {
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: lessons,
    isLoading: isLessonLoading,
    isFetching: isLessonFetching,
    refetch,
  } = useQuery(
    getLessonsByTeacherId(
      { teacherId, q: keyword, status: RecordStatus.Published, schoolYearId },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!keyword,
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToLesson(item))
            : undefined,
      },
    ),
  );

  const totalLessonCountText = useMemo(() => {
    if (!lessonCount) {
      return 'No lessons created';
    }

    return `${lessonCount > 1 ? 'Lessons' : 'Lesson'} created`;
  }, [lessonCount]);

  const toggleModal = useCallback(
    (open: boolean) => () => setOpenModal(open),
    [],
  );

  const handleButtonClick = useCallback(() => {
    if (lessons == null) refetch();
    toggleModal(true)();
  }, [lessons, toggleModal, refetch]);

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
            count={lessonCount}
            countLabel={totalLessonCountText}
            iconName='chalkboard-teacher'
            onClick={handleButtonClick}
          />
        )}
      </div>
      <BaseModal open={openModal} onClose={toggleModal(false)}>
        <LessonPickerList
          lessons={lessons || []}
          loading={isLessonLoading || isLessonFetching}
          onSearchChange={handleSearchChange}
        />
      </BaseModal>
    </>
  );
});
