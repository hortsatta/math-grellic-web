import { memo, useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import cx from 'classix';

import { BaseControlledInput } from '#/base/components/base-input.component';
import { BaseControlledPasswordInput } from '#/base/components/base-password-input.component';

import type { FormProps } from '#/base/models/base.model';
import type { UserRegisterLastStepFormData } from '../models/user-form-data.model';
import { BaseButton } from '#/base/components/base-button.components';

type FormData = Omit<UserRegisterLastStepFormData, 'token'>;
type Props = FormProps<'div', FormData, void>;

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password should be minimum of 8 characters')
      .max(100, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

const defaultValues: Partial<FormData> = {
  password: '',
  confirmPassword: '',
};

export const UserRegisterEmailConfirmLastStepForm = memo(function ({
  className,
  loading: formLoading,
  isDone,
  onSubmit,
  ...moreProps
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<FormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const loading = useMemo(
    () => formLoading || isSubmitting,
    [formLoading, isSubmitting],
  );

  const submitForm = useCallback(
    (data: FormData) => {
      try {
        onSubmit(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [onSubmit],
  );

  return (
    <div className={cx('w-full px-4 pt-8 lg:px-11', className)} {...moreProps}>
      <div className='mb-12'>
        <h1 className='mb-2 w-full text-center leading-tight xs:leading-normal sm:text-left'>
          Confirm Registration
        </h1>
        <p className='max-w-[600px] text-lg'>
          Please create your password to complete your registration.
        </p>
      </div>
      <FormProvider {...methods}>
        <form
          className='mx-auto flex w-full max-w-input flex-col gap-5'
          onSubmit={handleSubmit(submitForm)}
        >
          <fieldset
            className='group/field mx-auto flex flex-wrap gap-5'
            disabled={loading || isDone}
          >
            <BaseControlledPasswordInput
              name='password'
              label='Password'
              control={control}
              showPassword={showPassword}
              onShowPassword={setShowPassword}
              asterisk
            />
            <BaseControlledInput
              type={showPassword ? 'text' : 'password'}
              name='confirmPassword'
              label='Confirm Password'
              control={control}
            />
          </fieldset>
          <BaseButton
            type='submit'
            className='!h-16 w-full px-8 !text-xl xs:w-auto'
            rightIconName='share-fat'
            size='base'
            loading={loading}
            disabled={isDone}
          >
            Submit
          </BaseButton>
        </form>
      </FormProvider>
    </div>
  );
});
