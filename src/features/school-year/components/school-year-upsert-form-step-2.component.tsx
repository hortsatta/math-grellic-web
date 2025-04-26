import { memo, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import dayjs from '#/config/dayjs.config';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledRichTextEditor } from '#/base/components/base-rich-text-editor.component';
import { TeacherUserControlledPicker } from '#/user/components/teacher-user-picker.component';

import type { ComponentProps } from 'react';
import type { SchoolYearUpsertFormData } from '../models/school-year-form-data.model';

type Props = ComponentProps<'div'> & {
  isEditPublished: boolean;
  disabled?: boolean;
};

export const SchoolYearUpsertFormStep2 = memo(function ({
  isEditPublished,
  disabled,
  ...moreProps
}: Props) {
  const { control, setValue } = useFormContext<SchoolYearUpsertFormData>();

  const [startDate, endDate] = useWatch({
    control,
    name: ['startDate', 'endDate'],
  });

  useEffect(() => {
    const startYear = dayjs(startDate || null).year();
    const endYear = dayjs(endDate || null).year();

    if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
      setValue('title', undefined);
      return;
    }

    const yearText =
      startYear === endYear ? startYear : `${startYear}—${endYear}`;

    setValue('title', `SY ${yearText}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return (
    <div {...moreProps}>
      <div className='mb-4 italic'>This section is optional.</div>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        {!isEditPublished && (
          <>
            <div className='w-full items-start gap-5'>
              <TeacherUserControlledPicker
                name='teacherIds'
                label='Teachers'
                control={control}
              />
            </div>
            <BaseDivider />
          </>
        )}
        <BaseControlledInput
          label='Title'
          name='title'
          control={control}
          fullWidth
        />
        <BaseControlledRichTextEditor
          className='max-w-[600px]'
          label='Description'
          name='description'
          control={control}
          disabled={disabled}
        />
      </fieldset>
    </div>
  );
});
