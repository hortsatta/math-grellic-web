import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { capitalize } from '#/utils/string.util';
import {
  BaseControlledInput,
  BaseControlledPhoneInput,
} from '#/base/components/base-input.component';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';
import { BaseControlledSelect } from '#/base/components/base-select.component';
import { BaseDivider } from '#/base/components/base-divider.component';
import { UserGender } from '../models/user.model';

import type { ComponentProps } from 'react';
import type { Control } from 'react-hook-form';
import type { SelectOption } from '#/base/models/base.model';
import type { UserUpsertFormData } from '../models/user-form-data.model';

type Props = ComponentProps<'div'> & {
  isEdit?: boolean;
  disabled?: boolean;
};

const genders: SelectOption[] = [
  {
    label: capitalize(UserGender.Male),
    value: UserGender.Male,
  },
  {
    label: capitalize(UserGender.Female),
    value: UserGender.Female,
  },
];

const CreateForm = memo(function ({
  control,
}: {
  control: Control<UserUpsertFormData, any>;
}) {
  return (
    <>
      <div className=' w-full'>
        <BaseControlledInput
          label='First Name'
          name='firstName'
          control={control}
          fullWidth
          asterisk
        />
      </div>
      <div className='flex w-full items-start justify-between gap-5'>
        <BaseControlledInput
          label='Last Name'
          name='lastName'
          control={control}
          fullWidth
          asterisk
        />
        <BaseControlledInput
          label='Middle Name'
          name='middleName'
          control={control}
          fullWidth
          asterisk
        />
      </div>
      <div className='flex w-full items-start justify-between gap-5'>
        <BaseControlledSelect
          name='gender'
          label='Gender'
          options={genders}
          control={control}
          fullWidth
          asterisk
        />
        <BaseControlledDatePicker
          name='birthDate'
          label='Date of Birth'
          control={control}
          iconName='calendar'
          fullWidth
          asterisk
        />
      </div>
      <BaseDivider />
      <div className='flex w-full items-start justify-between gap-5'>
        <BaseControlledInput
          type='email'
          name='email'
          label='Email'
          control={control}
          fullWidth
          asterisk
        />
        <BaseControlledPhoneInput
          label='Phone Number'
          name='phoneNumber'
          control={control}
          fullWidth
          asterisk
        />
      </div>
    </>
  );
});

const EditForm = memo(function ({
  control,
}: {
  control: Control<UserUpsertFormData, any>;
}) {
  return (
    <>
      <div className='flex w-full items-start justify-between gap-5'>
        <BaseControlledInput
          label='First Name'
          name='firstName'
          control={control}
          fullWidth
          asterisk
        />
        <BaseControlledInput
          label='Last Name'
          name='lastName'
          control={control}
          fullWidth
          asterisk
        />
      </div>
      <div className='flex w-full items-start justify-between gap-5'>
        <BaseControlledInput
          label='Middle Name'
          name='middleName'
          control={control}
          fullWidth
          asterisk
        />
        <BaseControlledSelect
          name='gender'
          label='Gender'
          options={genders}
          control={control}
          fullWidth
          asterisk
        />
      </div>
      <div className='flex w-full items-start justify-between gap-5'>
        <BaseControlledDatePicker
          name='birthDate'
          label='Date of Birth'
          control={control}
          iconName='calendar'
          fullWidth
          asterisk
        />
        <BaseControlledPhoneInput
          label='Phone Number'
          name='phoneNumber'
          control={control}
          fullWidth
          asterisk
        />
      </div>
    </>
  );
});

export const UserUpsertFormStep1 = memo(function ({
  isEdit,
  disabled,
  ...moreProps
}: Props) {
  const { control } = useFormContext<UserUpsertFormData>();

  return (
    <div {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        {isEdit ? (
          <EditForm control={control} />
        ) : (
          <CreateForm control={control} />
        )}
      </fieldset>
    </div>
  );
});
