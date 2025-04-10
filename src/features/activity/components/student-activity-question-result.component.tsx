import { memo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { options } from '#/utils/scrollbar.util';
import { BaseChip } from '#/base/components/base-chip.component';
import { StudentActivityQuestionAnswer } from './student-activity-question-answer.component';

import type { ComponentProps } from 'react';
import type { ActivityCategoryQuestion } from '../models/activity.model';

type QuestionAnswer = {
  question: ActivityCategoryQuestion | undefined;
  selectedQuestionChoiceId?: number;
};

type Props = ComponentProps<'div'> & {
  questionAnswers: QuestionAnswer[];
  gameName: string;
  label?: string;
  labelHeading?: boolean;
};

export const StudentActivityQuestionResult = memo(function ({
  className,
  gameName,
  questionAnswers,
  label = 'Showing activity questions with your selected choices and answers.',
  labelHeading,
  ...moreProps
}: Props) {
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
            <BaseChip iconName='dice-three' isCompact>
              {gameName}
            </BaseChip>
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
                    <StudentActivityQuestionAnswer
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
