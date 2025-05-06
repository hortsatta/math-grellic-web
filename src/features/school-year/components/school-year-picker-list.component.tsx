import { memo, useCallback, useMemo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { useSchoolYearList } from '../hooks/use-school-year-list.hook';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '../models/school-year.model';

type Props = ComponentProps<'div'> & {
  selectedSchoolYearId?: number;
  onSchoolYearSelect: (schoolYear: SchoolYear) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

type SchoolYearItemProps = ComponentProps<'button'> & {
  schoolYear: SchoolYear;
  selected?: boolean;
  onClick?: () => void;
};

export const SchoolYearItem = memo(function ({
  className,
  schoolYear,
  selected,
  onClick,
  ...moreProps
}: SchoolYearItemProps) {
  const [title, isActive] = useMemo(
    () => [schoolYear.title, schoolYear.isActive],
    [schoolYear],
  );

  return (
    <button
      className={cx(
        'group/usrpicker flex w-full items-center justify-between overflow-hidden rounded-md px-4 py-2',
        onClick ? 'hover:bg-primary' : 'pointer-events-none',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div className='flex items-center gap-4'>
        <div className='flex h-11 w-11 items-center justify-center rounded bg-slate-200'>
          <BaseIcon name='graduation-cap' className='opacity-60' size={36} />
        </div>
        <div
          className={cx(
            'flex flex-col items-start',
            onClick && 'group-hover/usrpicker:text-white',
          )}
        >
          <span className='text-left font-medium'>{title}</span>
          {isActive && (
            <small className='uppercase leading-none text-primary-hue-purple-focus group-hover/usrpicker:text-white'>
              [Current]
            </small>
          )}
        </div>
      </div>
      <div className='flex h-9 w-9 items-center justify-center'>
        {selected && (
          <BaseIcon
            name='check-fat'
            className='text-green-500'
            size={28}
            weight='fill'
          />
        )}
      </div>
    </button>
  );
});

export const SchoolYearPickerList = memo(function ({
  className,
  selectedSchoolYearId,
  onSchoolYearSelect,
  onCancel,
  onSubmit,
  ...moreProps
}: Props) {
  const { schoolYears, loading } = useSchoolYearList();

  const handleSchoolYearSelect = useCallback(
    (schoolYear: SchoolYear) => () => onSchoolYearSelect(schoolYear),
    [onSchoolYearSelect],
  );

  return (
    <div
      className={cx('flex flex-col items-center justify-between', className)}
      {...moreProps}
    >
      <div className='w-full overflow-hidden'>
        <div className='relative h-[450px] w-full'>
          {loading && (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          )}
          <OverlayScrollbarsComponent
            className='my-2 h-[450px] w-full px-4'
            defer
          >
            <ul className={cx('w-full', loading && 'opacity-50')}>
              {(schoolYears as SchoolYear[]).map((schoolYear) => (
                <li
                  key={`sy-${schoolYear.id}`}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <SchoolYearItem
                    schoolYear={schoolYear}
                    selected={selectedSchoolYearId === schoolYear.id}
                    onClick={handleSchoolYearSelect(schoolYear)}
                  />
                </li>
              ))}
            </ul>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      <div className='flex w-full items-center justify-between gap-4 px-5 pt-2.5 xs:px-0'>
        <BaseButton variant='link' onClick={onCancel}>
          Cancel
        </BaseButton>
        <BaseButton onClick={onSubmit}>Select School Year</BaseButton>
      </div>
    </div>
  );
});
