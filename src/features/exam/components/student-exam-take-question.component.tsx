import { memo, useCallback } from 'react';
import { useController } from 'react-hook-form';
import toast from 'react-hot-toast';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { ExamQuestion } from '../models/exam.model';
import type { StudentExamFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<typeof BaseSurface> & {
  question: ExamQuestion;
  isExpired?: boolean;
  preview?: boolean;
};

type ControlledProps = Props & UseControllerProps<StudentExamFormData>;

export const StudentExamTakeQuestion = memo(function ({
  className,
  isExpired,
  question: { id: questionId, orderNumber, text, choices },
  preview,
  name,
  control,
  ...moreProps
}: ControlledProps) {
  const {
    field: { value, onChange },
  } = useController<any>({ name, control });

  const getChoiceLabel = useCallback(
    (index: number) => alphabet[index].toUpperCase(),
    [],
  );

  const isChoiceSelected = useCallback(
    (id: number) => value?.selectedQuestionChoiceId === id,
    [value],
  );

  const handleChange = useCallback(
    (choiceId: number) => () => {
      if (isExpired) {
        toast.error(`Time's up. Please submit exam`);
        return;
      }

      if (isChoiceSelected(choiceId)) {
        onChange(undefined);
        return;
      }

      if (preview) {
        onChange({
          questionId: orderNumber,
          selectedQuestionChoiceId: choiceId,
        });
      } else {
        onChange({ questionId, selectedQuestionChoiceId: choiceId });
      }
    },
    [preview, isExpired, questionId, orderNumber, onChange, isChoiceSelected],
  );

  return (
    <BaseSurface
      id={`q-${orderNumber}`}
      className={cx('w-full overflow-hidden !p-0', className)}
      rounded='sm'
      {...moreProps}
    >
      <div className='flex flex-col items-start gap-x-1 border-b border-accent/20 px-5 py-2.5 xs:flex-row xs:items-start xs:py-0 xs:pl-5 xs:pr-1'>
        <span className='pb-2.5 font-medium opacity-70 xs:py-[18px] xs:pr-2.5'>
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
        {choices.map(({ orderNumber, id, text }) => (
          <li
            key={`c-${orderNumber}`}
            className='w-full border-b border-accent/20 last:border-b-0'
          >
            <div
              role='button'
              className={cx(
                'group/choice relative flex w-full items-center',
                isExpired && 'cursor-default',
              )}
              onClick={handleChange(preview ? orderNumber : id)}
            >
              {isChoiceSelected(preview ? orderNumber : id) && (
                <div className='z-11 absolute right-0 top-0.5 flex h-full items-start justify-center px-3 py-2.5 text-green-500 xs:left-0 xs:right-auto'>
                  <BaseIcon name='check-fat' weight='fill' size={20} />
                </div>
              )}
              <div
                className={cx(
                  'flex min-h-[40px] flex-1 flex-wrap items-start pr-5 transition-[padding] xs:flex-nowrap',
                  isChoiceSelected(preview ? orderNumber : id)
                    ? 'bg-green-100 pl-5 xs:pl-10'
                    : 'bg-white pl-5',
                  !isExpired && 'group-hover/choice:bg-green-100',
                )}
              >
                <span
                  className={cx(
                    'mb-1 mt-3 font-medium opacity-70 xs:mb-0 xs:mr-2.5',
                    isChoiceSelected(preview ? orderNumber : id) &&
                      'text-green-600',
                  )}
                >
                  {getChoiceLabel(orderNumber - 1)}.
                </span>
                <div className='w-full'>
                  <BaseRichTextOutput
                    label={getChoiceLabel(orderNumber - 1)}
                    text={text}
                    active
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </BaseSurface>
  );
});
