import { memo, useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import cx from 'classix';

import { alphabet } from '#/utils/string.util';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseIconButton } from '#/base/components/base-icon-button.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledMathInput } from '#/base/components/base-math-input.component';
import { BaseImageUploader } from '#/base/components/base-image-uploader.component';
import { BaseTooltip } from '#/base/components/base-tooltip.component';
import { ActivityTextType } from '../models/activity.model';

import type { ChangeEvent, ComponentProps } from 'react';
import type {
  ActivityCategoryQuestionChoiceFormData,
  ActivityUpsertFormData,
} from '../models/activity-form-data.model';

type Props = ComponentProps<'div'> & {
  categoryIndex: number;
  questionIndex: number;
  isCollapsed?: boolean;
};

type ChoiceProps = {
  index: number;
  questionIndex: number;
  categoryIndex: number;
  choice: ActivityCategoryQuestionChoiceFormData;
  choiceName: string;
  choiceLabel: string;
  onSetAnswer: () => void;
  onSetTextType: () => void;
  onUploadChange: (file: any) => void;
  onRemove: () => void;
  onImageRemove: () => void;
};

const Choice = memo(function ({
  index,
  questionIndex,
  categoryIndex,
  choice,
  choiceName,
  choiceLabel,
  onSetAnswer,
  onSetTextType,
  onUploadChange,
  onRemove,
  onImageRemove,
}: ChoiceProps) {
  const { control, formState } = useFormContext<ActivityUpsertFormData>();

  const [textType, isCorrect] = useMemo(
    () => [choice.textType, choice.isCorrect, choice.imageData],
    [choice],
  );

  const imageData = useWatch({
    control,
    name: `categories.${categoryIndex}.questions.${questionIndex}.choices.${index}.imageData`,
  });

  const iconButtonProps = useMemo(
    () => ({
      className: cx(
        'mr-3 !h-6 !w-6 opacity-40 hover:opacity-100',
        isCorrect && '!opacity-100',
      ),
      iconProps: {
        weight: 'fill',
        className: isCorrect ? 'text-green-500' : '',
      } as ComponentProps<typeof BaseIconButton>['iconProps'],
    }),
    [isCorrect],
  );

  const choiceTextTypeIconName = useMemo(() => {
    switch (textType) {
      case ActivityTextType.Text:
        return 'function';
      case ActivityTextType.Expression:
        return 'image-square';
      default:
        return 'text-t';
    }
  }, [textType]);

  const textTypeTooltipText = useMemo(() => {
    switch (textType) {
      case ActivityTextType.Text:
        return 'Switch to expression input';
      case ActivityTextType.Expression:
        return 'Switch to image input';
      default:
        return 'Switch to text input';
    }
  }, [textType]);

  const errorMessage = useMemo(() => {
    try {
      const errorCategory: any = (formState.errors.categories as any)[
        categoryIndex
      ];

      if (!errorCategory) {
        return undefined;
      }

      return (
        errorCategory.questions &&
        errorCategory.questions[questionIndex]?.choices &&
        (errorCategory.questions[questionIndex]?.choices as any)[index]
          ?.imageData?.message
      );
    } catch (error) {
      return null;
    }
  }, [formState, index, questionIndex, categoryIndex]);

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

  return (
    <div className='max-w-qcWrapperInput flex w-full items-start'>
      <div className='flex h-12 items-center justify-center'>
        <BaseIconButton
          name='check-fat'
          variant='link'
          size='xs'
          onClick={onSetAnswer}
          {...iconButtonProps}
        />
      </div>
      <div className='max-w-qcInput relative w-full'>
        {textType !== ActivityTextType.Image ? (
          <div className='flex h-fit flex-1 basis-full items-center gap-x-2.5 overflow-hidden'>
            {textType === ActivityTextType.Text ? (
              <BaseControlledInput
                className='w-full pr-[43px]'
                name={choiceName}
                control={control}
                leftContent={
                  <div
                    className={cx(
                      'absolute left-15px top-1/2 flex w-6 -translate-y-1/2 items-center justify-center text-lg font-medium',
                      isCorrect ? 'text-green-500' : 'text-accent/50',
                    )}
                  >
                    {choiceLabel}
                  </div>
                }
                fullWidth
              />
            ) : (
              <BaseControlledMathInput
                className='flex min-h-[48px] w-full items-center pr-[43px]'
                name={choiceName}
                control={control}
                leftContent={
                  <div
                    className={cx(
                      'absolute left-15px top-1/2 flex w-6 -translate-y-1/2 items-center justify-center text-lg font-medium',
                      isCorrect ? 'text-green-500' : 'text-accent/50',
                    )}
                  >
                    {choiceLabel}
                  </div>
                }
                fullWidth
              />
            )}
          </div>
        ) : (
          <div className='group/image relative'>
            <BaseImageUploader
              className='w-full'
              name={choiceName}
              value={imageData}
              errorMessage={errorMessage}
              onChange={handleUploadChange}
              onRemove={onImageRemove}
              fullWidth
            />
            <span
              className={cx(
                'absolute left-15px top-2.5 z-20 flex w-6 items-center justify-center overflow-hidden rounded-sm bg-white',
                'text-lg font-medium leading-snug opacity-0 group-hover/image:!opacity-100',
                isCorrect ? 'text-green-500' : 'text-accent/50',
              )}
            >
              {choiceLabel}
            </span>
          </div>
        )}
        <div className='absolute right-2 top-1.5 z-20'>
          <BaseTooltip content={textTypeTooltipText} placement='left'>
            <BaseIconButton
              name={choiceTextTypeIconName}
              variant='link'
              size='xs'
              className='!text-accent hover:!text-primary'
              onClick={onSetTextType}
            />
          </BaseTooltip>
        </div>
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

export const ActivityUpsertPointTimeQuestionChoiceList = memo(function ({
  className,
  categoryIndex,
  questionIndex,
  isCollapsed,
  ...moreProps
}: Props) {
  const setExActImageEdit = useBoundStore((state) => state.setExActImageEdit);
  const { control, getValues, setValue } =
    useFormContext<ActivityUpsertFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `categories.${categoryIndex}.questions.${questionIndex}.choices`,
    keyName: 'key',
  });

  useEffect(() => {
    const sourceChoices = getValues(
      `categories.${categoryIndex}.questions.${questionIndex}.choices`,
    );

    fields.forEach((_, index) => {
      setValue(
        `categories.${categoryIndex}.questions.${questionIndex}.choices.${index}`,
        {
          ...sourceChoices[index],
          orderNumber: index + 1,
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, questionIndex]);

  const choices = useWatch({
    control,
    name: `categories.${categoryIndex}.questions.${questionIndex}.choices`,
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

      return choice?.textType === ActivityTextType.Image
        ? `categories.${categoryIndex}.questions.${questionIndex}.choices.${choiceIndex}.imageData`
        : `categories.${categoryIndex}.questions.${questionIndex}.choices.${choiceIndex}.text`;
    },
    [fields, categoryIndex, questionIndex],
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
      const choice = fields.find(
        (field: ActivityCategoryQuestionChoiceFormData & { key: string }) =>
          field.key === key,
      );
      const choiceIndex = fields.findIndex((field) => field.key === key);

      if (!choice) {
        return;
      }

      let textType = ActivityTextType.Text;
      if (choice.textType === ActivityTextType.Text) {
        textType = ActivityTextType.Expression;
      } else if (choice.textType === ActivityTextType.Expression) {
        textType = ActivityTextType.Image;
      }

      update(choiceIndex, { ...choices[choiceIndex], textType });
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
    append({
      text: '',
      textType: ActivityTextType.Text,
      isCorrect: false,
    } as any);
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

  const handleImageRemove = useCallback(
    (key: string) => () => {
      const choiceIndex = fields.findIndex((field) => field.key === key);
      update(choiceIndex, { ...choices[choiceIndex], imageData: undefined });
    },
    [fields, choices, update],
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
          <Choice
            key={key}
            index={index}
            questionIndex={questionIndex}
            categoryIndex={categoryIndex}
            choice={moreFields}
            choiceName={getChoiceName(key)}
            choiceLabel={getChoiceLabel(key)}
            onSetAnswer={setAnswer(key)}
            onSetTextType={setTextType(key)}
            onUploadChange={handleUploadChange(key)}
            onRemove={handleRemove(key)}
            onImageRemove={handleImageRemove(key)}
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
