import { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseControlledAdvancedRichTextEditor } from '#/base/components/base-advanced-rich-text-editor.component';
import { BaseControlledRichTextOutput } from '#/base/components/base-rich-text-output.component';

import type { ChangeEvent, ComponentProps } from 'react';
import type {
  ExamQuestionChoiceFormData,
  ExamUpsertFormData,
} from '../models/exam-form-data.model';

type Props = ComponentProps<'div'> & {
  index: number;
  questionIndex: number;
  choice: ExamQuestionChoiceFormData;
  choiceName: string;
  choiceLabel: string;
  onSetAnswer: () => void;
  onSetTextType: () => void;
  onUploadChange: (file: any) => void;
  onRemove: () => void;
};

export const ExamUpsertQuestionChoice = memo(function ({
  choice,
  index,
  questionIndex,
  choiceLabel,
  onSetAnswer,
  onUploadChange,
  onRemove,
}: Props) {
  const exActFocusedIndex = useBoundStore((state) => state.exActFocusedIndex);
  const setExActFocusedIndex = useBoundStore(
    (state) => state.setExActFocusedIndex,
  );
  const { control } = useFormContext<ExamUpsertFormData>();
  const text = useWatch({
    control,
    name: `questions.${questionIndex}.choices.${index}.text`,
  });
  const imageData = useWatch({
    control,
    name: `questions.${questionIndex}.choices.${index}.imageData`,
  });

  const [name, focusedIndex] = useMemo(
    () => [
      `questions.${questionIndex}.choices.${index}.text`,
      `q${questionIndex}c${index}`,
    ],
    [index, questionIndex],
  );

  const iconButtonProps = useMemo(
    () => ({
      className: cx(
        'mr-3 !h-6 !w-6 opacity-40 hover:opacity-100',
        choice.isCorrect && '!opacity-100',
      ),
      iconProps: {
        weight: 'fill',
        className: choice.isCorrect ? 'text-green-500' : '',
      } as ComponentProps<typeof BaseIconButton>['iconProps'],
    }),
    [choice.isCorrect],
  );

  const imageInputProps = useMemo(
    () => ({
      name: `questions.${questionIndex}.choices.${index}.imageData`,
      id: `questions.${questionIndex}.choices.${index}.imageData`,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;

        if (!files?.length || !onUploadChange) {
          return;
        }

        onUploadChange(files[0]);
      },
    }),
    [index, questionIndex, onUploadChange],
  );

  const handleFocus = useCallback(() => {
    setExActFocusedIndex(focusedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex]);

  const handleCloseEditor = useCallback(() => {
    setExActFocusedIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex w-full max-w-[578px] items-start'>
      <div className='flex h-12 items-center justify-center'>
        <BaseIconButton
          name='check-fat'
          variant='link'
          size='xs'
          onClick={onSetAnswer}
          {...iconButtonProps}
        />
      </div>
      <div className='relative w-full'>
        {exActFocusedIndex === focusedIndex ? (
          <BaseControlledAdvancedRichTextEditor
            className='max-w-[478px]'
            name={name}
            label={choiceLabel}
            control={control}
            imageData={imageData}
            imageInputProps={imageInputProps}
            close={handleCloseEditor}
            small
          />
        ) : (
          <BaseControlledRichTextOutput
            name={name}
            keyPrefix={`${focusedIndex}-`}
            label={choiceLabel}
            text={text}
            control={control}
            onClick={handleFocus}
          />
        )}
      </div>
      <BaseIconButton
        name='x-square'
        variant='link'
        className='ml-1'
        onClick={onRemove}
      />
    </div>
  );
});
