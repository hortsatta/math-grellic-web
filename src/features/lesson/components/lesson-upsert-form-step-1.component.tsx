import { memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  BaseControlledInput,
  BaseControlledNumberInput,
} from '#/base/components/base-input.component';
import { BaseControlledDurationInput } from '#/base/components/base-duration-input.component';
import { BaseControlledRichTextEditor } from '#/base/components/base-rich-text-editor.component';

import type { ComponentProps } from 'react';
import type { IconName } from '#/base/models/base.model';
import type { LessonUpsertFormData } from '../models/lesson-form-data.model';

type Props = ComponentProps<'div'> & {
  isDetectDuration: boolean;
  isEmbeddable: boolean;
  disabled?: boolean;
  onIsDetectDuration: () => void;
  onEmbedPreview: () => void;
};

const FIELD_GROUP_CLASSNAME =
  'flex sm:flex-row flex-col w-full items-start justify-between gap-5';

export const LessonUpsertFormStep1 = memo(function ({
  isDetectDuration,
  isEmbeddable,
  disabled,
  onIsDetectDuration,
  onEmbedPreview,
  ...moreProps
}: Props) {
  const { control } = useFormContext<LessonUpsertFormData>();

  const durationIconButtonProps = useMemo(
    () => ({
      name: (!isDetectDuration ? 'gps-slash' : 'crosshair') as IconName,
      isInput: true,
      tooltip: isDetectDuration
        ? 'Disable auto-detect duration'
        : 'Auto-detect duration',
      onClick: () => onIsDetectDuration(),
    }),
    [isDetectDuration, onIsDetectDuration],
  );

  const embedIconButtonProps = useMemo(
    () => ({
      name: 'scan' as IconName,
      isInput: true,
      tooltip: isEmbeddable
        ? 'Show preview'
        : 'Show preview, cannot embed video',
      iconProps: {
        color: isEmbeddable ? 'currentColor' : 'red',
      },
      onClick: () => onEmbedPreview(),
    }),
    [isEmbeddable, onEmbedPreview],
  );

  return (
    <div {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className={FIELD_GROUP_CLASSNAME}>
          <BaseControlledInput
            label='Title'
            name='title'
            control={control}
            fullWidth
            asterisk
          />
          <BaseControlledNumberInput
            label='Lesson No.'
            name='orderNumber'
            control={control}
            fullWidth
            asterisk
          />
        </div>
        <div className={FIELD_GROUP_CLASSNAME}>
          <BaseControlledInput
            label='Video Url'
            name='videoUrl'
            control={control}
            rightButtonProps={embedIconButtonProps}
            fullWidth
            asterisk
          />
          <BaseControlledDurationInput
            label='Duration (hh:mm:ss)'
            name='duration'
            control={control}
            inputDisabled={isDetectDuration}
            rightButtonProps={durationIconButtonProps}
            fullWidth
          />
        </div>
        <div className='flex w-full flex-col gap-5'>
          <BaseControlledRichTextEditor
            className='max-w-[600px]'
            label='Description'
            name='description'
            control={control}
            disabled={disabled}
          />
          <BaseControlledInput
            label='Excerpt'
            name='excerpt'
            control={control}
            fullWidth
          />
        </div>
      </fieldset>
    </div>
  );
});
