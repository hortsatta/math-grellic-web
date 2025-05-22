import { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import { capitalize, getErrorMessage } from '#/utils/string.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseControlledSelect } from '#/base/components/base-select.component';
import { BaseControlledTextArea } from '#/base/components/base-textarea.component';
import { SchoolYearAcademicProgress } from '../models/school-year-enrollment.model';

import type { FieldErrors } from 'react-hook-form';
import type {
  FormProps,
  IconName,
  SelectOption,
} from '#/base/models/base.model';
import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearEnrollmentAcademicProgressFormData } from '../models/school-year-enrollment-form-data.model';

type Props = FormProps<
  'form',
  Partial<SchoolYearEnrollmentAcademicProgressFormData>,
  Promise<
    | {
        academicProgress: string;
        academicProgressRemarks?: string;
      }
    | undefined
  >
> & { schoolYear: SchoolYear; onCancel?: () => void };

const academicProgressOptions: SelectOption[] = [
  {
    label: capitalize(SchoolYearAcademicProgress.Ongoing),
    value: SchoolYearAcademicProgress.Ongoing,
  },
  {
    label: capitalize(SchoolYearAcademicProgress.Passed),
    value: SchoolYearAcademicProgress.Passed,
  },
  {
    label: capitalize(SchoolYearAcademicProgress.Failed),
    value: SchoolYearAcademicProgress.Failed,
  },
];

const schema = z.object({
  schoolYearId: z
    .number({
      required_error: 'School year is required',
      invalid_type_error: 'School year is invalid ',
    })
    .int()
    .gt(0),
  academicProgress: z.nativeEnum(SchoolYearAcademicProgress, {
    required_error: 'Set student progress',
    invalid_type_error: 'Set student progress',
  }),
  academicProgressRemarks: z.string().optional(),
});

export const StudentSchoolYearAcademicProgressUpdateForm = memo(function ({
  className,
  formData,
  schoolYear,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  onCancel,
  ...moreProps
}: Props) {
  const {
    control,
    formState: { isSubmitting },
    setValue,
    handleSubmit,
  } = useForm<SchoolYearEnrollmentAcademicProgressFormData>({
    shouldFocusError: false,
    defaultValues: formData,
    resolver: zodResolver(schema),
  });

  const academicProgress = useWatch({ control, name: 'academicProgress' });

  const loading = useMemo(
    () => formLoading || isSubmitting,
    [formLoading, isSubmitting],
  );

  const schoolYearOngoingText = useMemo(() => {
    if (schoolYear.isDone) return null;

    return `Note: Current school year is still ongoing, it is preferable to update the student's academic progress at the end of the school year.`;
  }, [schoolYear]);

  const [
    submitPrefixText,
    submitIconName,
    submitProgressText,
    submitProgressTextColor,
  ] = useMemo(() => {
    const prefixText = academicProgress
      ? 'Update Progress as'
      : 'Update Progress';

    switch (academicProgress) {
      case SchoolYearAcademicProgress.Passed:
        return [
          prefixText,
          'check-circle',
          SchoolYearAcademicProgress.Passed.toUpperCase(),
          'text-green-400',
        ];
      case SchoolYearAcademicProgress.Failed:
        return [
          prefixText,
          'x-circle',
          SchoolYearAcademicProgress.Failed.toUpperCase(),
          'text-red-400',
        ];
      case SchoolYearAcademicProgress.Ongoing:
        return [
          prefixText,
          'clock-countdown',
          SchoolYearAcademicProgress.Ongoing.toUpperCase(),
          null,
        ];
      default:
        return [prefixText, null, null, null];
    }
  }, [academicProgress]);

  const isProgressDone = useMemo(
    () =>
      academicProgress === SchoolYearAcademicProgress.Passed ||
      academicProgress === SchoolYearAcademicProgress.Failed,
    [academicProgress],
  );

  const handleSubmitError = useCallback(
    (errors: FieldErrors<SchoolYearEnrollmentAcademicProgressFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: SchoolYearEnrollmentAcademicProgressFormData) => {
      try {
        await onSubmit(data);
        onDone && onDone(true);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit, onDone],
  );

  useEffect(() => {
    // Clear remarks if academic progress value is set to ongoing
    if (academicProgress !== SchoolYearAcademicProgress.Ongoing) return;
    setValue('academicProgressRemarks', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicProgress]);

  return (
    <form
      className={cx(
        'flex h-full w-full max-w-sm flex-col gap-4 xs:h-auto',
        className,
      )}
      onSubmit={handleSubmit(submitForm, handleSubmitError)}
      {...moreProps}
    >
      <div className='flex w-full flex-col gap-4'>
        <h3 className='text-lg leading-tight'>
          Update student's overall academic progress
        </h3>
        {schoolYearOngoingText && (
          <small className='text-primary-hue-orange-focus'>
            {schoolYearOngoingText}
          </small>
        )}
        <fieldset
          className='flex w-full flex-col gap-2.5'
          disabled={isDone || loading}
        >
          <BaseControlledSelect
            className='w-full'
            name='academicProgress'
            label='Student Progress'
            options={academicProgressOptions}
            control={control}
            fullWidth
            asterisk
          />
          <BaseControlledTextArea
            className={cx(
              '!min-h-[100px] w-full',
              !isProgressDone && '!hidden',
            )}
            name='academicProgressRemarks'
            placeholder='Progress Remarks'
            control={control}
            fullWidth
          />
        </fieldset>
      </div>
      <div className='flex flex-col items-center gap-2.5'>
        <BaseButton
          type='submit'
          className='!h-16 w-full'
          size='base'
          disabled={loading}
        >
          {submitPrefixText}{' '}
          <p className={cx('flex items-center gap-1', submitProgressTextColor)}>
            {submitIconName && (
              <BaseIcon name={submitIconName as IconName} size={28} />
            )}
            {submitProgressText}
          </p>
        </BaseButton>
        <BaseButton
          className='!w-full'
          variant='border'
          disabled={loading}
          onClick={onCancel}
        >
          Close
        </BaseButton>
      </div>
    </form>
  );
});
