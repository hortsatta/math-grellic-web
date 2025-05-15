import { memo, useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { RecordStatus } from '#/core/models/core.model';
import { BaseItemCounterButton } from '#/base/components/base-item-counter-button.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { getExamsByTeacherId } from '../api/admin-exam.api';
import { transformToExam } from '../helpers/exam-transform.helper';
import { ExamList } from './exam-list.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  examCount: number;
  teacherId: number;
  schoolYearId?: number;
  loading?: boolean;
};

export const ExamCounterList = memo(function ({
  loading,
  examCount,
  teacherId,
  schoolYearId,
  ...moreProps
}: Props) {
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);

  const {
    data: exams,
    isLoading: isExamLoading,
    isFetching: isExamFetching,
    refetch,
  } = useQuery(
    getExamsByTeacherId(
      { teacherId, q: keyword, status: RecordStatus.Published, schoolYearId },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: !!keyword,
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToExam(item))
            : undefined,
      },
    ),
  );

  const totalExamCountText = useMemo(() => {
    if (!examCount) {
      return 'No exams created';
    }

    return `${examCount > 1 ? 'Exams' : 'Exam'} created`;
  }, [examCount]);

  const toggleModal = useCallback(
    (open: boolean) => () => setOpenModal(open),
    [],
  );

  const handleButtonClick = useCallback(() => {
    if (exams == null) refetch();
    toggleModal(true)();
  }, [exams, toggleModal, refetch]);

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
            className='hover:!border-primary-hue-purple-focus hover:!ring-primary-hue-purple-focus'
            countClassName='text-primary-hue-purple'
            count={examCount}
            countLabel={totalExamCountText}
            iconName='exam'
            onClick={handleButtonClick}
          />
        )}
      </div>
      <BaseModal open={openModal} onClose={toggleModal(false)}>
        <ExamList
          exams={exams || []}
          loading={isExamLoading || isExamFetching}
          onSearchChange={handleSearchChange}
        />
      </BaseModal>
    </>
  );
});
