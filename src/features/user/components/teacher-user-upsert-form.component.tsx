import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import isMobilePhone from 'validator/lib/isMobilePhone';
import toast from 'react-hot-toast';
import cx from 'classix';

import { getErrorMessage } from '#/utils/string.util';
import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDropdownButton } from '#/base/components/base-dropdown-button.component';
import { BaseDropdownMenu } from '#/base/components/base-dropdown-menu.component';
import { BaseStepper } from '#/base/components/base-stepper.component';
import { BaseStepperStep } from '#/base/components/base-stepper-step.component';
import { UserApprovalStatus, UserGender } from '../models/user.model';
import { UserUpsertFormStep1 } from './user-upsert-form-step-1.component';

import type { FieldErrors } from 'react-hook-form';
import type { FormProps, IconName } from '#/base/models/base.model';
import type { SchoolYearEnrollmentNew } from '#/school-year/models/school-year-enrollment.model';
import type { User } from '../models/user.model';
import type { UserUpsertFormData } from '../models/user-form-data.model';

type Props = Omit<
  FormProps<
    'div',
    UserUpsertFormData,
    Promise<User | SchoolYearEnrollmentNew | null>
  >,
  'onSubmit'
> & {
  onSubmit: (
    data: UserUpsertFormData,
  ) => Promise<User | SchoolYearEnrollmentNew | null>;
  schoolYearTitle?: string;
};

const TEACHER_LIST_PATH = `/${adminBaseRoute}/${adminRoutes.teacher.to}`;

const stepWrapperProps = {
  className: '!overflow-visible',
};

const schema = z.object({
  email: z.string().email('Provide your email address'),
  firstName: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
  lastName: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
  middleName: z
    .string()
    .min(1, 'Name is too short')
    .max(50, 'Name is too long')
    .optional(),
  birthDate: z
    .date({ required_error: 'Provide your date of birth' })
    .min(new Date('1900-01-01'), 'Date of birth is too old')
    .max(new Date(), 'Date of birth is too young'),
  phoneNumber: z
    .string()
    .refine((value) => isMobilePhone(value.replace(/[^0-9]/g, ''), 'en-PH'), {
      message: 'Phone number is invalid',
    }),
  gender: z.nativeEnum(UserGender, {
    required_error: 'Provide your gender',
  }),
  approvalStatus: z.nativeEnum(UserApprovalStatus).optional(),
});

const defaultValues: Partial<UserUpsertFormData> = {
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: undefined,
  phoneNumber: '',
  gender: undefined,
  approvalStatus: UserApprovalStatus.Pending,
};

export const TeacherUserUpsertForm = memo(function ({
  className,
  formData,
  loading: formLoading,
  schoolYearTitle,
  isDone,
  onDone,
  onSubmit,
  onDelete,
  ...moreProps
}: Props) {
  const navigate = useNavigate();

  const methods = useForm<UserUpsertFormData>({
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

  const [isEdit, editApprovalStatus] = useMemo(
    () => [!!formData, formData?.approvalStatus || undefined],
    [formData],
  );

  const [publishButtonLabel, publishButtonIconName]: [string, IconName] =
    useMemo(() => {
      if (!isEdit) {
        return [
          schoolYearTitle?.trim() ? `Enroll for ${schoolYearTitle}` : 'Enroll',
          'share-fat',
        ];
      }

      if (editApprovalStatus === UserApprovalStatus.Pending) {
        return ['Approve', 'share-fat'];
      }

      return ['Save Changes', 'floppy-disk-back'];
    }, [schoolYearTitle, isEdit, editApprovalStatus]);

  const handleReset = useCallback(() => {
    reset(isEdit ? formData : defaultValues);
  }, [isEdit, formData, reset]);

  const handleSubmitError = useCallback(
    (errors: FieldErrors<UserUpsertFormData>) => {
      const errorMessage = getErrorMessage(errors);
      toast.error(errorMessage || '');
    },
    [],
  );

  const submitForm = useCallback(
    async (data: UserUpsertFormData, approvalStatus?: UserApprovalStatus) => {
      // TODO check if edit, delete, back to pending or rejecting if teacher has completions

      try {
        const targetData = approvalStatus ? { ...data, approvalStatus } : data;
        await onSubmit(targetData);

        toast.success(
          isEdit
            ? 'Teacher updated'
            : 'Teacher registered and enrolled. A confirmation email has been sent',
        );

        onDone && onDone(true);
        navigate(TEACHER_LIST_PATH);
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
          onSubmit={handleSubmit(
            (data) =>
              submitForm(
                data,
                editApprovalStatus === UserApprovalStatus.Rejected
                  ? UserApprovalStatus.Rejected
                  : UserApprovalStatus.Approved,
              ),
            handleSubmitError,
          )}
        >
          <BaseStepper
            disabled={loading}
            onReset={handleReset}
            stepWrapperProps={stepWrapperProps}
            controlsRightContent={
              <div className='group-button'>
                <BaseButton
                  type='submit'
                  className='min-w-[180px]'
                  rightIconName={publishButtonIconName}
                  loading={loading}
                  disabled={isDone}
                >
                  {publishButtonLabel}
                </BaseButton>
                {isEdit && (
                  <BaseDropdownMenu disabled={loading}>
                    <Menu.Item
                      as={BaseDropdownButton}
                      className='text-red-500'
                      iconName='trash'
                      onClick={onDelete}
                      disabled={loading}
                    >
                      Delete Teacher
                    </Menu.Item>
                  </BaseDropdownMenu>
                )}
              </div>
            }
          >
            <BaseStepperStep label='Teacher Info'>
              <UserUpsertFormStep1 isEdit={isEdit} disabled={loading} />
            </BaseStepperStep>
          </BaseStepper>
        </form>
      </FormProvider>
    </div>
  );
});
