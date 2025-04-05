import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classix';

import { teacherBaseRoute, teacherRoutes } from '#/app/routes/teacher-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import { BaseModal } from '#/base/components/base-modal.component';
import {
  StudentExamPerformanceSingleCardSkeleton,
  StudentExamPerformanceSingleCard,
} from './student-exam-performance-single-card.component';
import { TeacherStudentExamPerformanceResult } from './teacher-student-exam-performance-result.component';

import type { ComponentProps } from 'react';
import type { Exam } from '#/exam/models/exam.model';
import type { ExamSchedule } from '#/exam/models/exam-schedule.model';

const EXAM_CREATE_TO = `/${teacherBaseRoute}/${teacherRoutes.exam.to}/${teacherRoutes.exam.createTo}`;

type Props = ComponentProps<'div'> & {
  exams: Exam[];
  loading?: boolean;
};

export const TeacherStudentExamPerformanceList = memo(function ({
  className,
  loading,
  exams,
  ...moreProps
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);

  const filteredExams = useMemo(
    () => exams?.filter((exams) => exams.schedules?.length),
    [exams],
  );

  const isEmpty = useMemo(() => !filteredExams?.length, [filteredExams]);

  const viewExamResult = useCallback((exam: Exam) => {
    setCurrentExam(exam);
    setOpenModal(true);
  }, []);

  const handleClose = useCallback(() => setCurrentExam(null), []);

  useEffect(() => {
    setOpenModal(!!currentExam);
  }, [currentExam]);

  return (
    <>
      <div
        className={cx(
          'flex w-full flex-1 flex-col gap-2.5 self-stretch',
          className,
        )}
        role='table'
        {...moreProps}
      >
        {loading ? (
          [...Array(4)].map((_, index) => (
            <StudentExamPerformanceSingleCardSkeleton key={index} />
          ))
        ) : isEmpty ? (
          <BaseDataEmptyMessage
            message='No exams available'
            linkTo={EXAM_CREATE_TO}
          />
        ) : (
          filteredExams.map((exam) => (
            <StudentExamPerformanceSingleCard
              key={exam.id}
              exam={exam}
              role='row'
              onResult={viewExamResult}
            />
          ))
        )}
      </div>
      <BaseModal open={openModal} onClose={handleClose}>
        {currentExam && (
          <TeacherStudentExamPerformanceResult
            slug={currentExam.slug}
            scheduleId={(currentExam.schedules as ExamSchedule[])[0].id}
          />
        )}
      </BaseModal>
    </>
  );
});
