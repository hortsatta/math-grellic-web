import { memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import z from 'zod';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { getErrorMessage } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { SchoolYearUpsertFormStep1 } from './school-year-upsert-form-step-1.component';
import { SchoolYearUpsertFormStep2 } from './school-year-upsert-form-step-2.component';

import type { FieldErrors } from 'react-hook-form';
import type { FormProps, IconName } from '#/base/models/base.model';
import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearUpsertFormData } from '../models/school-year-form-data.model';

type Props = FormProps<'div', SchoolYearUpsertFormData, Promise<SchoolYear>>;

const SCHOOL_YEAR_LIST_PATH = `/${adminBaseRoute}/${adminRoutes.schoolYear.to}`;

const schema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is too short')
      .max(255, 'Title is too long')
      .optional(),
    description: z.string().optional(),
    status: z.nativeEnum(RecordStatus),
    startDate: z
      .date({ required_error: 'Start date is required' })
      .min(
        new Date(`${new Date().getFullYear()}-01-01`),
        'Start date is invalid',
      ),
    endDate: z
      .date({ required_error: 'End date is required' })
      .min(
        new Date(`${new Date().getFullYear()}-01-01`),
        'End date is invalid',
      ),
    enrollmentStartDate: z
      .date({ required_error: 'Enrollment start date is required' })
      .min(
        new Date(`${new Date().getFullYear()}-01-01`),
        'Start date is invalid',
      ),
    enrollmentEndDate: z
      .date({ required_error: 'Enrollment end date is required' })
      .min(
        new Date(`${new Date().getFullYear()}-01-01`),
        'End date is invalid',
      ),
    gracePeriodEndDate: z
      .date()
      .min(new Date(`${new Date().getFullYear()}-01-01`), 'End date is invalid')
      .optional(),
    teacherIds: z.array(z.number()).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (dayjs(data.endDate).isSameOrBefore(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date should be before the end date',
        path: ['startDate'],
      });
    }

    if (
      dayjs(data.enrollmentEndDate).isSameOrBefore(data.enrollmentStartDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enrollment start date should be before the end date',
        path: ['enrollmentStartDate'],
      });
    }

    if (
      !dayjs(data.enrollmentStartDate).isBetween(
        data.startDate,
        data.endDate,
        'day',
        '[]',
      ) ||
      !dayjs(data.enrollmentEndDate).isBetween(
        data.startDate,
        data.endDate,
        'day',
        '[]',
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enrollment dates should be between the start and end dates',
        path: ['enrollmentStartDate', 'enrollmentEndDate'],
      });
    }

    if (
      data.gracePeriodEndDate &&
      dayjs(data.gracePeriodEndDate).isBefore(data.enrollmentEndDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Grace period should be after enrollment date',
        path: ['gracePeriodEndDate'],
      });
    }
  });

const defaultValues: Partial<SchoolYearUpsertFormData> = {
  title: undefined,
  description: '',
  status: RecordStatus.Draft,
  startDate: undefined,
  endDate: undefined,
  enrollmentStartDate: undefined,
  enrollmentEndDate: undefined,
  gracePeriodEndDate: undefined,
  teacherIds: undefined,
};

export const SchoolYearUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const [isEdit, isEditPublished] = useMemo(
    () => [!!formData, formData?.status === RecordStatus.Published],
    [formData],
  );

  const methods = useForm<SchoolYearUpsertFormData>({
    shouldFocusError: false,
    defaultValues: formData || defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = methods;

  const loading = useMemo(
    () => formLoading || isSubmitting || isDone,
    [formLoading, isSubmitting, isDone],
  );

  const [publishButtonLabel, publishButtonIconName]: [string, IconName] =
    useMemo(
      () => [
        isEditPublished ? 'Save Changes' : 'Publish Now',
        (isEditPublished ? 'floppy-disk-back' : 'share-fat') as IconName,
      ],
      [isEditPublished],
    );

  const handleReset = useCallback(() => {
    reset(isEdit ? formData : defaultValues);
  }, [isEdit, formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<SchoolYearUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: SchoolYearUpsertFormData, status?: RecordStatus) => {
      try {
        const targetData = status ? { ...data, status } : data;
        const schoolYear = await onSubmit(targetData);

        toast.success(
          `${isEdit ? 'Updated' : 'Created'} school year ${schoolYear.title}`,
        );

        onDone && onDone(true);
        navigate(SCHOOL_YEAR_LIST_PATH);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [isEdit, onSubmit, onDone, navigate],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => submitForm(data), handleSubmitError)}
        >
          <BaseStepper
            disabled={loading}
            onReset={handleReset}
            controlsRightContent={
              <div className='group-button w-full sm:w-auto'>
                <BaseButton
                  className='w-full'
                  rightIconName={publishButtonIconName}
                  loading={isSubmitting || loading}
                  disabled={isDone}
                  onClick={handleSubmit(
                    (data) => submitForm(data, RecordStatus.Published),
                    handleSubmitError,
                  )}
                >
                  {publishButtonLabel}
                </BaseButton>
                <BaseDropdownMenu disabled={loading}>
                  {(!isEdit || !isEditPublished) && (
                    <Menu.Item
                      as={BaseDropdownButton}
                      type='submit'
                      iconName='floppy-disk-back'
                      disabled={loading}
                    >
                      Save as Draft
                    </Menu.Item>
                  )}
                  {isEdit && (
                    <>
                      {!isEditPublished && <BaseDivider className='my-1' />}
                      <Menu.Item
                        as={BaseDropdownButton}
                        className='text-red-500'
                        iconName='trash'
                        onClick={onDelete}
                        disabled={loading}
                      >
                        Delete
                      </Menu.Item>
                    </>
                  )}
                </BaseDropdownMenu>
              </div>
            }
          >
            <BaseStepperStep label='School Year Schedule'>
              <SchoolYearUpsertFormStep1 disabled={loading} />
            </BaseStepperStep>
            <BaseStepperStep label='School Year Info'>
              <SchoolYearUpsertFormStep2
                isEditPublished={isEditPublished}
                disabled={loading}
              />
            </BaseStepperStep>
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
