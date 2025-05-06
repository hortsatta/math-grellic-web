import { memo, useCallback, useState } from 'react';
import cx from 'classix';

import { BaseModal } from '#/base/components/base-modal.component';
import { SchoolYearPickerList } from './school-year-picker-list.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '../models/school-year.model';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  open: boolean;
  value?: SchoolYear | null;
  onChange?: (value: SchoolYear) => void;
  onClose?: () => void;
};

export const SchoolYearPickerModal = memo(function ({
  className,
  value,
  open,
  onChange,
  onClose,
  ...moreProps
}: Props) {
  const [selectedValue, setSelectedValue] = useState<SchoolYear | null>(
    value || null,
  );

  const handleCancel = useCallback(() => {
    value && setSelectedValue(value);
    onClose && onClose();
  }, [value, onClose]);

  const handleSubmit = useCallback(() => {
    onChange && onChange((selectedValue || value) as SchoolYear);
  }, [value, selectedValue, onChange]);

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <BaseModal
        className='!min-h-0 !border-0 !px-0 !pb-8 xs:!px-10'
        size='sm'
        open={open}
        onClose={onClose}
      >
        <SchoolYearPickerList
          selectedSchoolYearId={selectedValue?.id || value?.id}
          onSchoolYearSelect={setSelectedValue}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </BaseModal>
    </div>
  );
});
