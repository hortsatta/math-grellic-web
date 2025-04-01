import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import {
  scoreShowVariants,
  scoreShowItemVariants,
} from '#/utils/animation.util';
import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { PerformanceRankAwardImg } from '#/performance/components/performance-rank-award-img.component';
import { StudentExamCompletionHistoryList } from './student-exam-completion-history-list.component';

import type { ComponentProps } from 'react';
import type { Exam, ExamCompletion } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  exam: Exam;
  examCompletion?: ExamCompletion;
  loading?: boolean;
  isExpired?: boolean;
};

const FIELD_WRAPPER_CLASSNAME = 'flex flex-col items-center gap-1.5';
const FIELD_VALUE_CLASSNAME = 'text-xl leading-none';
const FIELD_LABEL_CLASSNAME = 'uppercase';

export const StudentExamTakeDone = memo(function ({
  className,
  exam,
  examCompletion,
  loading,
  isExpired,
  ...moreProps
}: Props) {
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocalLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const [
    title,
    orderNumber,
    totalPoints,
    passingPoints,
    rank,
    schedules,
    recentSchedule,
  ] = useMemo(
    () => [
      exam.title,
      exam.orderNumber,
      exam.pointsPerQuestion * exam.visibleQuestionsCount,
      exam.passingPoints,
      exam.rank,
      exam.schedules || [],
      exam.schedules?.find((schedule) => schedule.isRecent),
    ],
    [exam],
  );

  const score = useMemo(() => examCompletion?.score ?? null, [examCompletion]);

  const [scheduleTitle, scheduleDate, scheduleTime] = useMemo(() => {
    let schedule = null;

    if (isExpired && recentSchedule) {
      schedule = recentSchedule;
    } else if (examCompletion) {
      schedule = examCompletion.schedule;
    } else {
      return [];
    }

    const { title, startDate, endDate } = schedule;

    if (!dayjs(startDate).isSame(endDate, 'day')) {
      return [];
    }

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;

    return [title, date, time];
  }, [isExpired, recentSchedule, examCompletion]);

  const totalPointsLabel = useMemo(
    () => `Total ${totalPoints > 1 ? 'Points' : 'Point'}`,
    [totalPoints],
  );

  const passingPointsLabel = useMemo(
    () => `Passing ${passingPoints > 1 ? 'Points' : 'Point'}`,
    [passingPoints],
  );

  const scoreSuffix = useMemo(
    () => ((score || 0) > 1 ? 'Points' : 'Point'),
    [score],
  );

  const hasPassed = useMemo(
    () => (score || 0) >= passingPoints,
    [score, passingPoints],
  );

  const rankText = useMemo(
    () => (rank == null ? '-' : generateOrdinalSuffix(rank)),
    [rank],
  );

  const handleReturn = useCallback(() => navigate('..'), [navigate]);

  const handleSetModal = useCallback(
    (isOpen: boolean) => () => {
      !loading && setOpenModal(isOpen);
    },
    [loading],
  );

  return (
    <>
      <div className={cx('w-full p-1.5', className)} {...moreProps}>
        {scheduleDate && (
          <div className='mb-6 flex flex-col gap-1'>
            <span className='px-2.5 text-sm'>
              Showing results for{' '}
              <span className='font-medium'>{scheduleTitle}</span>
            </span>
            <div className='inline-block w-max rounded-full border border-accent/20 px-4 py-2 text-sm opacity-80'>
              scheduled on <span className='font-medium'>{scheduleDate}</span>{' '}
              at <span className='font-medium'>{scheduleTime}</span>
            </div>
          </div>
        )}
        <div className='mb-5 flex items-center gap-x-2.5 text-primary'>
          {isExpired ? (
            <>
              <BaseIcon name='x-circle' size={36} weight='bold' />
              <h1 className='text-2xl'>Exam has expired</h1>
            </>
          ) : (
            <>
              <BaseIcon name='check-circle' size={36} weight='bold' />
              <h1 className='text-2xl'>Exam completed!</h1>
            </>
          )}
        </div>
        <div className='mb-12 flex flex-row flex-wrap items-start gap-x-4 px-2.5 xs:items-center'>
          <div className='mb-5 w-full xs:mb-0 xs:w-auto'>
            <BaseChip iconName='exam'>Exam {orderNumber}</BaseChip>
            <h2 className='font-body text-lg font-medium tracking-normal text-accent'>
              {title}
            </h2>
          </div>
          <BaseDivider className='hidden !h-12 xs:block' vertical />
          <div className={FIELD_WRAPPER_CLASSNAME}>
            <span className={FIELD_VALUE_CLASSNAME}>{totalPoints}</span>
            <small className={FIELD_LABEL_CLASSNAME}>{totalPointsLabel}</small>
          </div>
          <BaseDivider className='!h-12' vertical />
          <div className={FIELD_WRAPPER_CLASSNAME}>
            <span className={FIELD_VALUE_CLASSNAME}>{passingPoints}</span>
            <small className={FIELD_LABEL_CLASSNAME}>
              {passingPointsLabel}
            </small>
          </div>
        </div>
        <BaseSurface
          className='flex min-h-[200px] flex-col items-center !py-8'
          rounded='sm'
        >
          {localLoading || loading ? (
            <div className='flex h-full w-full flex-1 items-center justify-center'>
              <BaseSpinner />
            </div>
          ) : (
            <motion.div
              className='flex h-full w-full flex-col items-center'
              variants={scoreShowVariants}
              initial='hidden'
              animate='show'
            >
              <motion.div
                className='mb-2.5 flex flex-col items-center justify-center gap-2.5 px-5 text-primary -2xs:mb-8 -2xs:flex-row -2xs:gap-5'
                variants={scoreShowItemVariants}
              >
                {score != null && score > 0 && rank != null && (
                  <>
                    <div className='flex items-center gap-x-2.5'>
                      <span className='text-[40px] font-bold'>{rankText}</span>
                      {rank <= 10 && (
                        <PerformanceRankAwardImg rank={rank} size='lg' />
                      )}
                    </div>
                    <BaseDivider className='hidden !h-14 -2xs:block' vertical />
                  </>
                )}
                <div className='flex items-center gap-2.5 font-display text-3xl font-medium tracking-tighter -2xs:text-4xl'>
                  {isExpired ? (
                    <span>-</span>
                  ) : (
                    <>
                      <span>{score}</span>
                      <span>{scoreSuffix}</span>
                    </>
                  )}
                </div>
              </motion.div>
              <BaseDivider className='mb-2.5 block -2xs:hidden' />
              {hasPassed ? (
                <motion.div
                  className='flex flex-col items-center justify-center gap-2.5 text-green-500 -2xs:flex-row'
                  variants={scoreShowItemVariants}
                >
                  <BaseIcon name='check-circle' size={40} weight='bold' />
                  <h2 className='text-center text-2xl text-green-500 -2xs:text-left -2xs:text-3xl'>
                    You've Passed the Exam
                  </h2>
                </motion.div>
              ) : (
                <motion.div
                  className='flex flex-col items-center justify-center gap-2.5 text-red-500 -2xs:flex-row'
                  variants={scoreShowItemVariants}
                >
                  <BaseIcon name='x-circle' size={40} weight='bold' />
                  <h2 className='text-center text-2xl text-red-500 -2xs:text-left -2xs:text-3xl'>
                    You've Failed the Exam
                  </h2>
                </motion.div>
              )}
            </motion.div>
          )}
        </BaseSurface>
        <div className='flex w-full items-center justify-center gap-x-2.5 py-5'>
          <BaseButton
            variant='link'
            size='sm'
            leftIconName='arrow-circle-left'
            onClick={handleReturn}
          >
            Return
          </BaseButton>
          {schedules.length > 1 && (
            <>
              <BaseDivider className='!h-6' vertical />
              <BaseButton
                variant='link'
                size='sm'
                rightIconName='scroll'
                onClick={handleSetModal(true)}
              >
                View History
              </BaseButton>
            </>
          )}
        </div>
      </div>
      {schedules.length > 1 && (
        <BaseModal
          className='!pb-8 xs:!px-10'
          open={openModal}
          onClose={handleSetModal(false)}
        >
          <div>
            <StudentExamCompletionHistoryList exam={exam} />
          </div>
        </BaseModal>
      )}
    </>
  );
});
