import { memo, useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseAdvancedRichTextEditor } from '#/base/components/base-advanced-rich-text-editor.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';
import { ExamUpsertQuestionChoiceList } from './exam-upsert-question-choice-list.component';

import type { ChangeEvent, ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ExamUpsertFormData } from '../models/exam-form-data.model';

type Props = ComponentProps<typeof BaseSurface> & {
  index: number;
  onRemove: (index: number) => () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUploadChange: (file: any) => void;
  moveUpDisabled?: boolean;
  moveDownDisabled?: boolean;
  disabled?: boolean;
};

export const ExamUpsertQuestion = memo(function ({
  index,
  className,
  rounded = 'sm',
  onRemove,
  onMoveDown,
  onMoveUp,
  onUploadChange,
  moveUpDisabled,
  moveDownDisabled,
  disabled,
  ...moreProps
}: Props) {
  const exActFocusedIndex = useBoundStore((state) => state.exActFocusedIndex);
  const setExActFocusedIndex = useBoundStore(
    (state) => state.setExActFocusedIndex,
  );
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<ExamUpsertFormData>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const text = useWatch({ control, name: `questions.${index}.text` });
  const imageData = useWatch({ control, name: `questions.${index}.imageData` });

  const [name, focusedIndex] = useMemo(
    () => [`questions.${index}.text`, `q${index}`],
    [index],
  );

  const orderNumber = useMemo(
    () => (index + 1).toString().padStart(2, '0'),
    [index],
  );

  const imageInputProps = useMemo(
    () => ({
      name: `questions.${index}.imageData`,
      id: `questions.${index}.imageData`,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;

        if (!files?.length || !onUploadChange) {
          return;
        }

        onUploadChange(files[0]);
      },
    }),
    [index, onUploadChange],
  );

  const textErrorMessage = useMemo(
    () => errors.questions?.[index]?.text?.message,
    [errors, index],
  );

  const handleTextChange = useCallback(
    (value: string) => {
      setValue(name as any, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleFocus = useCallback(() => {
    setExActFocusedIndex(focusedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex]);

  const handleCloseEditor = useCallback(() => {
    setExActFocusedIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseSurface
      className={cx('w-full !px-0 !pb-2.5 !pt-1', className)}
      rounded={rounded}
      {...moreProps}
    >
      <div className='mb-2.5 flex w-full items-center justify-between border-b border-b-accent/20 px-5'>
        <span className='text-xl font-medium text-accent/50'>
          {orderNumber}
        </span>
        <div className='flex items-center'>
          <BaseTooltip content='Move Up'>
            <BaseIconButton
              name='arrow-circle-up'
              variant='link'
              className='!w-8'
              disabled={moveUpDisabled}
              onClick={onMoveUp}
            />
          </BaseTooltip>
          <BaseTooltip content='Move Down'>
            <BaseIconButton
              name='arrow-circle-down'
              variant='link'
              className='!w-8'
              disabled={moveDownDisabled}
              onClick={onMoveDown}
            />
          </BaseTooltip>
        </div>
      </div>
      <div className='px-2.5'>
        <div className='flex items-start'>
          <div className='flex h-input items-center justify-center pr-2'>
            <BaseIconButton
              name={(isCollapsed ? 'caret-right' : 'caret-down') as IconName}
              variant='link'
              size='sm'
              onClick={handleIsCollapsed}
            />
          </div>
          <div className='relative w-full max-w-qcInput'>
            {exActFocusedIndex === focusedIndex ? (
              <BaseAdvancedRichTextEditor
                className='max-w-qcInput'
                label={`Question ${orderNumber}`}
                initialValue={text}
                value={text}
                errorMessage={textErrorMessage}
                disabled={disabled}
                imageData={imageData}
                imageInputProps={imageInputProps}
                close={handleCloseEditor}
                onChange={handleTextChange}
              />
            ) : (
              <BaseRichTextOutput
                className='!min-h-[60px]'
                keyPrefix={`${focusedIndex}-`}
                label={`Question ${orderNumber}`}
                text={text}
                errorMessage={textErrorMessage}
                disabled={disabled}
                onClick={handleFocus}
              />
            )}
          </div>
          <div className='ml-1 flex h-input items-center justify-center'>
            <BaseIconButton
              name='x'
              variant='link'
              size='sm'
              onClick={onRemove(index)}
            />
          </div>
        </div>
        <ExamUpsertQuestionChoiceList
          className='mt-4'
          questionIndex={index}
          isCollapsed={isCollapsed}
          disabled={disabled}
        />
      </div>
    </BaseSurface>
  );
});
