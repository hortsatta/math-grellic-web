import { memo, useCallback, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { getErrorMessage } from '#/utils/string.util';
import { UserRole } from '#/user/models/user.model';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseControlledInput } from '#/base/components/base-input.component';

import type { FieldErrors } from 'react-hook-form';
import type { FormProps } from '#/base/models/base.model';
import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearEnrollment } from '../models/school-year-enrollment.model';
import type { SchoolYearEnrollmentCreateFormData } from '../models/school-year-enrollment-form-data.model';

type Props = FormProps<
  'div',
  SchoolYearEnrollmentCreateFormData,
  Promise<SchoolYearEnrollment>
> & { schoolYear: SchoolYear };

const schema = z
  .object({
    schoolYearId: z
      .number({
        required_error: 'School year is required',
        invalid_type_error: 'School year is invalid ',
      })
      .int()
      .gt(0),
    role: z.nativeEnum(UserRole),
    teacherId: z
      .string()
      .length(11, 'ID must be 11 characters long')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === UserRole.Student &&
      data.teacherId?.trim().length !== 11
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Teacher id is invalid',
        path: ['teacherId'],
      });
    }

    if (data.role !== UserRole.Student && data.role !== UserRole.Teacher) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'User is invalid',
        path: ['role'],
      });
    }
  });

const defaultValues: Partial<SchoolYearEnrollmentCreateFormData> = {
  schoolYearId: undefined,
  role: undefined,
  teacherId: undefined,
};

export const SchoolYearEnrollmentCreateForm = memo(function ({
  className,
  formData,
  schoolYear,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  ...moreProps
}: Props) {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<SchoolYearEnrollmentCreateFormData>({
    shouldFocusError: false,
    defaultValues: { ...defaultValues, ...formData },
    resolver: zodResolver(schema),
  });

  const role = useWatch({ control, name: 'role' });

  const loading = useMemo(
    () => formLoading || isSubmitting,
    [formLoading, isSubmitting],
  );

  const [title, canEnroll, enrollmentStartDateText, enrollmentEndDateText] =
    useMemo(
      () => [
        schoolYear.title,
        schoolYear.canEnroll,
        dayjs(schoolYear.startDate).format('MMM DD, YYYY'),
        dayjs(schoolYear.gracePeriodEndDate).format('MMM DD, YYYY'),
      ],
      [schoolYear],
    );

  const notDoneText = useMemo(() => {
    if (!canEnroll) {
      return `It looks like you are not within the enrollment period (${enrollmentStartDateText} - ${enrollmentEndDateText}). Please contact your teacher for assistance.`;
    }

    return role === UserRole.Student
      ? `You're almost ready to start learning — but it looks like you
            haven't enrolled for the ${title} yet. Please enter your teacher's id to complete your enrollment.`
      : `You're almost ready — but it looks like you
            haven't enrolled for the ${title} yet. Please tap the button complete your enrollment.`;
  }, [role, title, canEnroll, enrollmentStartDateText, enrollmentEndDateText]);

  const doneText = useMemo(
    () =>
      role === UserRole.Student
        ? `Your enrollment has been submitted and is now being reviewed from your teacher. Hang tight — we'll notify you as soon as you're approved!`
        : `Your enrollment has been submitted and is now being reviewed from the admin. Hang tight — we'll notify you as soon as you're approved!`,
    [role],
  );

  const handleSubmitError = useCallback(
    (errors: FieldErrors<SchoolYearEnrollmentCreateFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: SchoolYearEnrollmentCreateFormData) => {
      try {
        await onSubmit(data);
        onDone && onDone(true);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit, onDone],
  );

  return (
    <div className={cx('w-full max-w-xl', className)} {...moreProps}>
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit(submitForm, handleSubmitError)}
      >
        {isDone ? <p>{doneText}</p> : <p>{notDoneText}</p>}
        <fieldset className='w-full max-w-xs' disabled={isDone || loading}>
          {role === UserRole.Student && (
            <BaseControlledInput
              label="Teacher's ID"
              name='teacherId'
              control={control}
              fullWidth
              asterisk
            />
          )}
        </fieldset>
        <div className='flex items-center gap-2.5'>
          <BaseButton
            className='w-full max-w-xs'
            rightIconName='share-fat'
            loading={loading}
            disabled={isDone || !canEnroll}
            onClick={handleSubmit(submitForm, handleSubmitError)}
          >
            Enroll Now
          </BaseButton>
          {isDone && (
            <BaseIcon
              className='text-green-500'
              name='check-circle'
              size={44}
              weight='bold'
            />
          )}
        </div>
      </form>
    </div>
  );
});
