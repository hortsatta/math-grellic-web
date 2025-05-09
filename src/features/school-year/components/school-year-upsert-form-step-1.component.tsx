import { ComponentProps, memo, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseControlledDatePicker } from '#/base/components/base-date-picker.component';

import type { SchoolYearUpsertFormData } from '../models/school-year-form-data.model';

type Props = ComponentProps<'div'> & {
  disabled?: boolean;
};

const FIELD_GROUP_CLASSNAME =
  'flex w-full flex-col items-start justify-between gap-5 -2xs:flex-row';

const calendarSelectorProps = {
  minDate: new Date(`${new Date().getFullYear() - 5}-01-01`),
  maxDate: new Date(`${new Date().getFullYear() + 10}-12-31`),
};

export const SchoolYearUpsertFormStep1 = memo(function ({
  disabled,
  ...moreProps
}: Props) {
  const { control } = useFormContext<SchoolYearUpsertFormData>();

  const [
    startDate,
    endDate,
    enrollmentStartDate,
    enrollmentEndDate,
    gracePeriodEndDate,
  ] = useWatch({
    control,
    name: [
      'startDate',
      'endDate',
      'enrollmentStartDate',
      'enrollmentEndDate',
      'gracePeriodEndDate',
    ],
  });

  const [durationText, isDurationValid] = useMemo(() => {
    const startDateDayjs = dayjs(startDate || null).startOf('day');
    const endDateDayjs = dayjs(endDate || null).endOf('day');

    const duration =
      startDateDayjs.isValid() &&
      endDateDayjs.isValid() &&
      !endDateDayjs.isBefore(startDateDayjs)
        ? endDateDayjs.diff(startDateDayjs, 'days') + 1
        : 0;

    if (duration <= 0) {
      return ['Please fill in dates properly', false];
    }

    const durationText = `${duration} ${duration > 1 ? 'days' : 'day'}`;

    return [durationText, true];
  }, [startDate, endDate]);

  const [enrollmentDurationText, isEnrollmentDurationValid] = useMemo(() => {
    const startDate = dayjs(enrollmentStartDate || null).startOf('day');
    const endDate = dayjs(enrollmentEndDate || null).endOf('day');
    const graceEndDate = dayjs(gracePeriodEndDate || null).endOf('day');

    const enrollmentDuration =
      startDate.isValid() && endDate.isValid() && !endDate.isBefore(startDate)
        ? endDate.diff(startDate, 'days') + 1
        : 0;

    const graceDuration =
      endDate.isValid() &&
      graceEndDate.isValid() &&
      !graceEndDate.isBefore(startDate)
        ? graceEndDate.diff(endDate, 'days')
        : null;

    if (
      enrollmentDuration <= 0 ||
      (graceEndDate.isValid() && graceDuration == null) ||
      (graceDuration || 0) < 0
    ) {
      return ['Please fill in dates properly', false];
    }

    const graceDurationText =
      graceDuration == null || graceDuration <= 0
        ? 'no grace period'
        : `${graceDuration} ${graceDuration > 1 ? 'days' : 'day'} grace period`;

    const durationText = `${enrollmentDuration} ${
      enrollmentDuration > 1 ? 'days' : 'day'
    } with ${graceDurationText}`;

    return [durationText, true];
  }, [enrollmentStartDate, enrollmentEndDate, gracePeriodEndDate]);

  return (
    <div {...moreProps}>
      <fieldset
        className='group/field flex flex-wrap gap-5'
        disabled={disabled}
      >
        <div className={FIELD_GROUP_CLASSNAME}>
          <BaseControlledDatePicker
            name='startDate'
            label='Start Date'
            control={control}
            iconName='calendar'
            calendarSelectorProps={calendarSelectorProps}
            asterisk
            fullWidth
          />
          <BaseControlledDatePicker
            name='endDate'
            label='End Date'
            control={control}
            iconName='calendar'
            placement='bottom-end'
            calendarSelectorProps={calendarSelectorProps}
            asterisk
            fullWidth
          />
        </div>
        <div className='flex w-full items-baseline justify-center gap-x-2 border-y border-accent/20 bg-white px-4 py-2.5'>
          <span>School Year Duration:</span>
          <span
            className={cx(isDurationValid ? 'font-medium' : 'text-sm italic')}
          >
            {durationText}
          </span>
        </div>
        <BaseDivider />
        <div className={FIELD_GROUP_CLASSNAME}>
          <BaseControlledDatePicker
            name='enrollmentStartDate'
            label='Enrollment Start Date'
            control={control}
            iconName='calendar'
            calendarSelectorProps={calendarSelectorProps}
            asterisk
            fullWidth
          />
          <BaseControlledDatePicker
            name='enrollmentEndDate'
            label='Enrollment End Date'
            control={control}
            iconName='calendar'
            placement='bottom-end'
            calendarSelectorProps={calendarSelectorProps}
            asterisk
            fullWidth
          />
        </div>
        <div className={FIELD_GROUP_CLASSNAME}>
          <BaseControlledDatePicker
            name='gracePeriodEndDate'
            label='Grace Period End Date'
            control={control}
            iconName='calendar'
            calendarSelectorProps={calendarSelectorProps}
            fullWidth
          />
          <div className='w-full' />
        </div>
        <div className='flex w-full items-baseline justify-center gap-x-2 border-y border-accent/20 bg-white px-4 py-2.5'>
          <span>Enrollment Duration:</span>
          <span
            className={cx(
              isEnrollmentDurationValid ? 'font-medium' : 'text-sm italic',
            )}
          >
            {enrollmentDurationText}
          </span>
        </div>
      </fieldset>
    </div>
  );
});
