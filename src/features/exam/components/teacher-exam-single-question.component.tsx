import { memo, useCallback, useMemo, useState } from 'react';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ExamQuestion, ExamQuestionChoice } from '../models/exam.model';

type Props = ComponentProps<typeof BaseSurface> & {
  question: ExamQuestion;
};

const Choice = memo(function ({
  choice: { orderNumber, text, isCorrect },
}: {
  choice: ExamQuestionChoice;
}) {
  const getChoiceLabel = useCallback(
    (index: number) => alphabet[index].toUpperCase(),
    [],
  );

  return (
    <li className='w-full border-b border-accent/20 last:border-b-0'>
      <div className='relative flex w-full items-center'>
        {isCorrect && (
          <div className='z-11 absolute right-0 top-0.5 flex h-full items-start justify-center px-3 py-2.5 text-green-500 xs:left-0 xs:right-auto'>
            <BaseIcon name='check-fat' weight='fill' size={20} />
          </div>
        )}
        <div className='flex min-h-[40px] flex-1 flex-wrap items-start bg-white pl-5 pr-5 transition-[padding] group-hover/choice:bg-green-100 xs:flex-nowrap xs:pl-10'>
          <span
            className={cx(
              'mx-0 mt-3 inline-block w-6 text-left font-medium opacity-70 xs:mx-2.5',
              isCorrect && 'text-green-600',
            )}
          >
            {getChoiceLabel(orderNumber - 1)}.
          </span>
          <div className='w-full xs:w-auto'>
            <BaseRichTextOutput
              label={getChoiceLabel(orderNumber - 1)}
              text={text}
              active
            />
          </div>
        </div>
      </div>
    </li>
  );
});

export const TeacherExamSingleQuestion = memo(function ({
  className,
  question,
  ...moreProps
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [orderNumber, text, choices, answer] = useMemo(
    () => [
      question.orderNumber,
      question.text,
      question.choices,
      question.choices.find((c) => c.isCorrect),
    ],
    [question],
  );

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <BaseSurface
      className={cx('w-full overflow-hidden !p-0', className)}
      rounded='sm'
      {...moreProps}
    >
      <div
        className={cx(
          'flex flex-wrap items-start justify-between gap-x-1 border-b border-accent/20 pb-2.5 pl-5 pr-1 xs:flex-nowrap xs:justify-start xs:px-1 xs:pb-0',
        )}
      >
        <div className='flex items-center justify-center xs:h-input'>
          <BaseIconButton
            name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
            variant='link'
            size='sm'
            onClick={handleIsCollapsed}
          />
        </div>
        <span className='order-first py-2.5 pr-2.5 font-medium opacity-70 xs:order-none xs:py-[18px]'>
          {orderNumber.toString().padStart(2, '0')}.
        </span>
        <BaseRichTextOutput
          className='!min-h-[60px]'
          label={`Question ${orderNumber}`}
          text={text}
          active
        />
      </div>
      <ol className='flex flex-col items-start rounded-sm'>
        {isCollapsed
          ? answer && <Choice choice={answer} />
          : choices.map((choice) => (
              <Choice key={`c-${choice.id}`} choice={choice} />
            ))}
      </ol>
    </BaseSurface>
  );
});
