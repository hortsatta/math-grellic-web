import { memo, useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseControlledTextArea } from '#/base/components/base-textarea.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { BaseImageUploader } from '#/base/components/base-image-uploader.component';
import { ActivityTextType } from '../models/activity.model';
import { ActivityUpsertPointTimeQuestionChoiceList } from './activity-upsert-point-time-question-choice-list.component';

import type { ChangeEvent, ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { ActivityUpsertFormData } from '../models/activity-form-data.model';

type Props = ComponentProps<typeof BaseSurface> & {
  index: number;
  categoryIndex: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUploadChange: (file: any) => void;
  moveUpDisabled?: boolean;
  moveDownDisabled?: boolean;
};

export const ActivityUpsertPointTimeQuestion = memo(function ({
  className,
  index,
  categoryIndex,
  onRemove,
  onMoveDown,
  onMoveUp,
  onUploadChange,
  moveUpDisabled,
  moveDownDisabled,
  ...moreProps
}: Props) {
  const { control, setValue, formState } =
    useFormContext<ActivityUpsertFormData>();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const textType = useWatch({
    control,
    name: `categories.${categoryIndex}.questions.${index}.textType`,
  });

  const imageData = useWatch({
    control,
    name: `categories.${categoryIndex}.questions.${index}.imageData`,
  });

  const questionTextTypeIconName = useMemo(
    () => (textType !== ActivityTextType.Text ? 'text-t' : 'image-square'),
    [textType],
  );

  const orderNumber = useMemo(
    () => (index + 1).toString().padStart(2, '0'),
    [index],
  );

  const errorMessage = useMemo(() => {
    try {
      const errorCategory = (formState.errors.categories as any)[categoryIndex];

      if (!errorCategory) {
        return undefined;
      }

      return (
        errorCategory.questions &&
        errorCategory.questions[index]?.imageData?.message
      );
    } catch (error) {
      return null;
    }
  }, [formState, index, categoryIndex]);

  const textTypeTooltipText = useMemo(() => {
    if (textType === ActivityTextType.Text) {
      return 'Switch to image input';
    } else {
      return 'Switch to text input';
    }
  }, [textType]);

  const handleIsCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const setTextType = useCallback(() => {
    const value =
      textType === ActivityTextType.Text
        ? ActivityTextType.Image
        : ActivityTextType.Text;

    setValue(`categories.${categoryIndex}.questions.${index}.textType`, value);
  }, [index, categoryIndex, textType, setValue]);

  const handleUploadChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;

      if (!files?.length || !onUploadChange) {
        return;
      }

      onUploadChange(files[0]);
    },
    [onUploadChange],
  );

  const handleImageRemove = useCallback(() => {
    setValue(
      `categories.${categoryIndex}.questions.${index}.imageData`,
      undefined,
    );
  }, [index, categoryIndex, setValue]);

  return (
    <BaseSurface
      className={cx('w-full !px-0 !pb-2.5 !pt-1', className)}
      rounded='sm'
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
          <div className='relative w-full max-w-[485px]'>
            {textType === ActivityTextType.Text ? (
              <BaseControlledTextArea
                className='w-full'
                name={`categories.${categoryIndex}.questions.${index}.text`}
                placeholder='Question'
                control={control}
                fullWidth
              />
            ) : (
              <BaseImageUploader
                className='w-full'
                name={`categories.${categoryIndex}.questions.${index}.imageData`}
                value={imageData}
                errorMessage={errorMessage}
                onChange={handleUploadChange}
                onRemove={handleImageRemove}
                fullWidth
              />
            )}
            <div className='absolute right-3.5 top-3 z-20'>
              <BaseTooltip content={textTypeTooltipText}>
                <BaseIconButton
                  name={questionTextTypeIconName}
                  variant='link'
                  size='xs'
                  className='!text-accent hover:!text-primary'
                  onClick={setTextType}
                />
              </BaseTooltip>
            </div>
          </div>
          <div className='ml-1 flex h-input items-center justify-center'>
            <BaseIconButton
              name='x'
              variant='link'
              size='sm'
              onClick={onRemove}
            />
          </div>
        </div>
        <ActivityUpsertPointTimeQuestionChoiceList
          className='mt-4'
          categoryIndex={categoryIndex}
          questionIndex={index}
          isCollapsed={isCollapsed}
        />
      </div>
    </BaseSurface>
  );
});
