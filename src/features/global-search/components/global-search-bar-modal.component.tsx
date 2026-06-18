import { memo, useCallback, useRef, useState } from 'react';
import cx from 'classix';

import { BaseButton } from '#/base/components/base-button.components';
import { BaseModal } from '#/base/components/base-modal.component';
import { BaseSearchInput } from '#/base/components/base-search-input.component';

import type { ComponentProps, FormEvent } from 'react';

type Props = Omit<ComponentProps<'div'>, 'onSubmit'> & {
  open: boolean;
  onSubmit: (keyword: string | null) => void;
  onClose?: () => void;
};

export const GlobalSearchBarModal = memo(function ({
  className,
  open,
  onSubmit,
  onClose,
  ...moreProps
}: Props) {
  const [keyword, setKeyword] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit(keyword);
    },
    [keyword, onSubmit],
  );

  return (
    <div className={cx('w-full', className)} {...moreProps}>
      <BaseModal
        className='!min-h-0 !border-0 !px-0 !pb-8 xs:!px-10'
        size='sm'
        open={open}
        initialFocus={searchRef}
        onClose={onClose}
      >
        <form
          className='flex items-center px-4 pb-3 xs:px-0'
          onSubmit={handleSubmit}
        >
          <BaseSearchInput
            ref={searchRef}
            className='rounded-r-none border-r-0'
            placeholder='Looking for something?'
            delay={0}
            onChange={setKeyword}
            fullWidth
          />
          <BaseButton className='rounded-l-none' type='submit'>
            Search
          </BaseButton>
        </form>
      </BaseModal>
    </div>
  );
});
