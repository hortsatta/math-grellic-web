import { memo, useMemo } from 'react';
import cx from 'classix';

import { StudentExamCompletionHistoryItem } from './student-exam-completion-history-item.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';
import type { ExamSchedule } from '../models/exam-schedule.model';

type Props = ComponentProps<'div'> & {
  exam: Exam;
};

const ITEM_WRAPPER_CLASSNAME = 'flex flex-col gap-2';

export const StudentExamCompletionHistoryList = memo(function ({
  className,
  exam,
  ...moreProps
}: Props) {
  const [schedules, completions, totalPoints, passingPoints] = useMemo(
    () => [
      exam.schedules,
      exam.completions,
      exam.visibleQuestionsCount * exam.pointsPerQuestion,
      exam.passingPoints,
    ],
    [exam],
  );

  const [highestLabel, highestCompletion] = useMemo(() => {
    const completion = completions?.find((com) => com.isHighest);

    if (!completion) {
      return [];
    }

    return [
      completion?.isRecent ? 'Highest and Recent Score' : 'Highest Score',
      completion,
    ];
  }, [completions]);

  const recentCompletion = useMemo(
    () =>
      highestCompletion?.isRecent
        ? null
        : completions?.find((com) => com.isRecent),
    [completions, highestCompletion],
  );

  const otherSchedules = useMemo(() => {
    const filteredSchedules =
      schedules?.filter(
        (sched) =>
          sched.id !== highestCompletion?.schedule.id &&
          sched.id !== recentCompletion?.schedule.id,
      ) || [];

    return filteredSchedules.map((sched) => ({
      schedule: sched,
      completion: completions?.find((com) => com.schedule.id === sched.id),
    }));
  }, [schedules, completions, highestCompletion, recentCompletion]);

  return (
    <div className={cx('flex flex-col gap-4', className)} {...moreProps}>
      {highestCompletion && (
        <div className={ITEM_WRAPPER_CLASSNAME}>
          <h3 className='text-base'>{highestLabel}</h3>
          <StudentExamCompletionHistoryItem
            passingPoints={passingPoints}
            totalPoints={totalPoints}
            schedule={highestCompletion.schedule as ExamSchedule}
            completion={highestCompletion}
          />
        </div>
      )}
      {recentCompletion && (
        <div className={ITEM_WRAPPER_CLASSNAME}>
          <h3 className='text-base'>Latest Score</h3>
          <StudentExamCompletionHistoryItem
            passingPoints={passingPoints}
            totalPoints={totalPoints}
            schedule={recentCompletion.schedule as ExamSchedule}
            completion={recentCompletion}
          />
        </div>
      )}
      {!!otherSchedules.length && (
        <div className={ITEM_WRAPPER_CLASSNAME}>
          <h3 className='text-base'>Other Scores</h3>
          {otherSchedules.map(({ schedule, completion }) => (
            <StudentExamCompletionHistoryItem
              key={schedule.id}
              passingPoints={passingPoints}
              totalPoints={totalPoints}
              schedule={schedule}
              completion={completion}
            />
          ))}
        </div>
      )}
    </div>
  );
});
