import { memo, useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { ExActTextType } from '#/core/models/core.model';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { ExamUpsertQuestionChoice } from './exam-upsert-question-choice.component';

import type { ComponentProps } from 'react';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<'div'> & {
  questionIndex: number;
  isCollapsed?: boolean;
};

export const ExamUpsertQuestionChoiceList = memo(function ({
  className,
  questionIndex,
  isCollapsed,
  ...moreProps
}: Props) {
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const { control, getValues, setValue } = useFormContext<ExamUpsertFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
    keyName: 'key',
  });

  useEffect(() => {
    const sourceChoices = getValues(`questions.${questionIndex}.choices`);

    fields.forEach((_, index) => {
      setValue(`questions.${questionIndex}.choices.${index}`, {
        ...sourceChoices[index],
        orderNumber: index + 1,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, questionIndex]);

  const choices = useWatch({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  const filteredFields = useMemo(
    () => (isCollapsed ? fields.filter((field) => field.isCorrect) : fields),
    [fields, isCollapsed],
  );

  const hasAnswer = useMemo(() => {
    return !!choices.find((choice) => choice.isCorrect);
  }, [choices]);

  const getChoiceName = useCallback(
    (key: string) => {
      const choice = fields.find((field) => field.key === key);
      const choiceIndex = fields.findIndex((field) => field.key === key);

      return choice?.textType === ExActTextType.Image
        ? `questions.${questionIndex}.choices.${choiceIndex}.imageData`
        : `questions.${questionIndex}.choices.${choiceIndex}.text`;
    },
    [fields, questionIndex],
  );

  const getChoiceLabel = useCallback(
    (key: string) => {
      const choiceIndex = fields.findIndex((field) => field.key === key);
      return alphabet[choiceIndex].toUpperCase();
    },
    [fields],
  );

  const setAnswer = useCallback(
    (key: string) => () => {
      // Set all choice's isCorrect to false first, then set target to true
      choices.forEach((choice, choiceIndex) => {
        update(choiceIndex, { ...choice, isCorrect: false });
      });
      const choiceIndex = fields.findIndex((field) => field.key === key);
      update(choiceIndex, { ...choices[choiceIndex], isCorrect: true });
    },
    [fields, choices, update],
  );

  const setTextType = useCallback(
    (key: string) => () => {
      const choice = fields.find((field) => field.key === key);
      const choiceIndex = fields.findIndex((field) => field.key === key);

      if (!choice) {
        return;
      }

      let textType = ExActTextType.Text;
      if (choice.textType === ExActTextType.Text) {
        textType = ExActTextType.Expression;
      } else if (choice.textType === ExActTextType.Expression) {
        textType = ExActTextType.Image;
      }

      update(choiceIndex, {
        ...choices[choiceIndex],
        textType,
      });
    },
    [fields, choices, update],
  );

  const handleUploadChange = useCallback(
    (key: string) => (file: any) => {
      const cIndex = fields.findIndex((field) => field.key === key);

      setExActImageEdit({
        index: questionIndex,
        cIndex,
        file,
      });
    },
    [questionIndex, fields, setExActImageEdit],
  );

  const handleAppend = useCallback(() => {
    append({ text: '', textType: ExActTextType.Text, isCorrect: false } as any);
  }, [append]);

  const handleRemove = useCallback(
    (key: string) => () => {
      if (fields?.length <= 2) {
        toast.error('Question must have at least 2 choices');
        return;
      }

      const choiceIndex = fields.findIndex((field) => field.key === key);
      remove(choiceIndex);
    },
    [fields, remove],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      {!isCollapsed ? (
        <span className='mb-2 block text-center text-sm font-medium'>
          Choices
        </span>
      ) : (
        !hasAnswer && (
          <span className='mb-2 block text-center text-sm font-medium'>
            No Answer Selected
          </span>
        )
      )}
      <div className='flex w-full flex-col items-center gap-y-2.5'>
        {filteredFields.map(({ key, ...moreFields }, index) => (
          <ExamUpsertQuestionChoice
            key={key}
            index={index}
            questionIndex={questionIndex}
            choice={moreFields}
            choiceName={getChoiceName(key)}
            choiceLabel={getChoiceLabel(key)}
            onSetAnswer={setAnswer(key)}
            onSetTextType={setTextType(key)}
            onUploadChange={handleUploadChange(key)}
            onRemove={handleRemove(key)}
          />
        ))}
        {!isCollapsed && (
          <BaseButton
            className='group/append w-full overflow-hidden rounded bg-transparent py-2 !transition-[background] hover:bg-primary'
            variant='link'
            size='sm'
            onClick={handleAppend}
          >
            <BaseIcon
              name='plus-circle'
              size='24'
              className='group-hover/append:!text-white'
            />
          </BaseButton>
        )}
      </div>
    </div>
  );
});
