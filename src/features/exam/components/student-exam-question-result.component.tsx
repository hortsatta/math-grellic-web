import { memo, useMemo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { options } from '#/utils/scrollbar.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { StudentExamQuestionAnswer } from './student-exam-question-answer.component';

import type { ComponentProps } from 'react';
import type { ExamQuestion } from '../models/exam.model';
import type { ExamSchedule } from '../models/exam-schedule.model';

type QuestionAnswer = {
  question: ExamQuestion | undefined;
  selectedQuestionChoiceId?: number;
};

type Props = ComponentProps<'div'> & {
  questionAnswers: QuestionAnswer[];
  schedule: ExamSchedule;
  label?: string;
  labelHeading?: boolean;
};

export const StudentExamQuestionResult = memo(function ({
  className,
  questionAnswers,
  schedule,
  label = 'Showing exam questions with your selected choices and answers.',
  labelHeading,
  ...moreProps
}: Props) {
  const [date, time] = useMemo(() => {
    const { startDate, endDate } = schedule;

    const date = dayjs(startDate).format('MMM DD, YYYY');
    const time = `${dayjs(startDate).format('hh:mm A')} — ${dayjs(
      endDate,
    ).format('hh:mm A')}`;

    return [date, time];
  }, [schedule]);

  return (
    <div
      className={cx(
        'h-[550px]',
        questionAnswers.length ? 'xs:h-[450px]' : 'xs:h-52',
        className,
      )}
      {...moreProps}
    >
      <OverlayScrollbarsComponent
        className='h-full w-full px-0 pb-2.5 xs:px-4'
        options={options}
        defer
      >
        {labelHeading ? (
          <div className='mb-2.5 flex flex-col'>
            <h3 className='text-base'>{label}</h3>
            <div className='flex flex-col gap-1 -3xs:flex-row -3xs:gap-2.5'>
              <BaseChip iconName='calendar-check' isCompact>
                {date}
              </BaseChip>
              <BaseDivider className='hidden !h-6 -3xs:inline-block' vertical />
              <BaseChip iconName='clock' isCompact>
                {time}
              </BaseChip>
            </div>
          </div>
        ) : (
          <div className='mb-2.5'>{label}</div>
        )}
        {questionAnswers.length ? (
          <ol className='flex w-full flex-col gap-y-2.5'>
            {questionAnswers.map(
              ({ question, selectedQuestionChoiceId }, index) =>
                question && (
                  <li key={`ans-${question.id}`} className='w-full'>
                    <StudentExamQuestionAnswer
                      key={`qa-${index}`}
                      question={question}
                      selectedChoiceId={selectedQuestionChoiceId}
                    />
                  </li>
                ),
            )}
          </ol>
        ) : (
          <div className='flex h-full max-h-36 items-center justify-center'>
            Viewing of results currently not available.
          </div>
        )}
      </OverlayScrollbarsComponent>
    </div>
  );
});
