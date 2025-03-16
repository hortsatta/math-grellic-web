import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';

import type { ComponentProps } from 'react';
import type { ExamQuestion, ExamQuestionChoice } from '../models/exam.model';

type Props = ComponentProps<typeof BaseSurface> & {
  question: ExamQuestion;
  selectedChoiceId?: number;
};

type ChoiceProps = {
  className?: string;
  choice?: ExamQuestionChoice;
};

const Choice = memo(function ({ className, choice }: ChoiceProps) {
  const { orderNumber, text, isCorrect } = useMemo(
    () => choice || ({} as ExamQuestionChoice),
    [choice],
  );

  const getChoiceLabel = useCallback(
    (index: number) => alphabet[index].toUpperCase(),
    [],
  );

  return (
    <div
      className={cx(
        'flex w-full items-start',
        isCorrect ? 'bg-green-100' : 'bg-red-100',
        className,
      )}
    >
      {!choice ? (
        <>
          <div className='h-full px-2.5 py-2 text-red-500'>
            <BaseIcon name='x-circle' size={28} weight='bold' />
          </div>
          <div className='min-h-[40px] flex-1 py-2.5 pr-5'>
            <span className='text-accent/80'>None selected</span>
          </div>
        </>
      ) : (
        <>
          <div
            className={cx(
              'h-full py-[9px] pl-3 pr-3.5',
              isCorrect ? 'text-green-500' : 'text-red-500',
            )}
          >
            {isCorrect ? (
              <BaseIcon name='check-circle' size={28} weight='bold' />
            ) : (
              <BaseIcon name='x-circle' size={28} weight='bold' />
            )}
          </div>
          <div className='flex min-h-[40px] flex-1 items-start pr-5'>
            <span
              className={cx(
                'mr-1 inline-block w-6 py-3 text-left font-medium opacity-70',
                isCorrect ? 'text-green-600' : 'text-red-600',
              )}
            >
              {getChoiceLabel(orderNumber - 1)}.
            </span>
            <BaseRichTextOutput
              label={getChoiceLabel(orderNumber - 1)}
              text={text}
              active
            />
          </div>
        </>
      )}
    </div>
  );
});

export const StudentExamQuestionAnswer = memo(function ({
  className,
  question,
  selectedChoiceId,
  ...moreProps
}: Props) {
  const [orderNumber, text, choices, selectedChoice] = useMemo(
    () => [
      question.orderNumber,
      question.text,
      question.choices,
      question.choices.find((c) => c.id === selectedChoiceId),
    ],
    [question, selectedChoiceId],
  );

  const answerChoice = useMemo(() => {
    if (selectedChoice?.isCorrect) {
      return null;
    }

    return choices.find((c) => c.isCorrect);
  }, [selectedChoice, choices]);

  return (
    <BaseSurface
      className={cx('w-full overflow-hidden !p-0', className)}
      rounded='sm'
      {...moreProps}
    >
      <div
        className={cx(
          'flex items-start gap-x-1 border-b border-accent/20 px-4',
        )}
      >
        <span className='py-[18px] pr-2.5 font-medium opacity-70'>
          {orderNumber.toString().padStart(2, '0')}.
        </span>
        <BaseRichTextOutput
          className='!min-h-[60px]'
          label={`Question ${orderNumber}`}
          text={text}
          active
        />
      </div>
      <div className='flex flex-col items-start rounded-sm'>
        <Choice choice={selectedChoice} />
        {answerChoice && <Choice className='!bg-white' choice={answerChoice} />}
      </div>
    </BaseSurface>
  );
});
