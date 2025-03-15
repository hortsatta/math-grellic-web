import { memo, useCallback, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import cx from 'classix';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.components';
import { defaultQuestion } from '../helpers/exam-form.helper';
import { ExamUpsertQuestion } from './exam-upsert-question.component';

import type { ComponentProps } from 'react';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

const liAnimation = {
  type: 'spring',
  damping: 30,
  stiffness: 200,
};

export const ExamUpsertQuestionList = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const { control, getValues, setValue } = useFormContext<ExamUpsertFormData>();

  const {
    fields: questions,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: 'questions',
    keyName: 'key',
  });

  useEffect(() => {
    const sourceQuestions = getValues('questions');

    questions.forEach((_, index) => {
      setValue(`questions.${index}`, {
        ...sourceQuestions[index],
        orderNumber: index + 1,
      });
    });

    setValue('visibleQuestionsCount', questions.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const handleAppend = useCallback(() => {
    append(defaultQuestion);
  }, [append]);

  const handleRemove = useCallback(
    (index: number) => () => {
      if (questions?.length <= 1) {
        toast.error('Exam must have at least 1 question');
        return;
      }

      remove(index);
    },
    [questions, remove],
  );

  const handleMove = useCallback(
    (index: number, isUp: boolean) => () => {
      if (isUp) {
        index > 0 && move(index, index - 1);
      } else {
        index < questions.length - 1 && move(index, index + 1);
      }
    },
    [move, questions],
  );

  const handleUploadChange = useCallback(
    (index: number) => (file: any) => {
      setExActImageEdit({
        index,
        file,
      });
    },
    [setExActImageEdit],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-col items-center justify-start gap-y-2.5 pb-8',
        className,
      )}
      {...moreProps}
    >
      <ul className='flex w-full flex-col items-center justify-start gap-y-2.5'>
        {questions.map((field, index) => (
          <motion.li
            key={field.key}
            className='w-full'
            transition={liAnimation}
            layout
          >
            <ExamUpsertQuestion
              index={index}
              onRemove={handleRemove}
              onMoveUp={handleMove(index, true)}
              onMoveDown={handleMove(index, false)}
              onUploadChange={handleUploadChange(index)}
              moveUpDisabled={index <= 0}
              moveDownDisabled={index >= questions.length - 1}
            />
          </motion.li>
        ))}
      </ul>
      <BaseButton
        className='w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary hover:text-white'
        leftIconName='plus-circle'
        variant='link'
        size='sm'
        onClick={handleAppend}
      >
        Add Question
      </BaseButton>
    </div>
  );
});
