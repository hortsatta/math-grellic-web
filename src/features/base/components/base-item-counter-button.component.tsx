import { memo } from 'react';
import cx from 'classix';

import { BaseIcon } from './base-icon.component';

import type { ComponentProps } from 'react';
import type { IconName } from '../models/base.model';

type Props = ComponentProps<'button'> & {
  count: number;
  countLabel?: string;
  iconName?: IconName;
  countClassName?: string;
};

export const BaseItemCounterButton = memo(function ({
  className,
  count,
  countLabel,
  iconName,
  countClassName,
  onClick,
  ...moreProps
}: Props) {
  return (
    <button
      className={cx(
        'flex flex-col gap-1 rounded-md px-5 py-2.5 transition-all hover:cursor-pointer hover:!border-primary-focus hover:shadow-md hover:ring-1 hover:ring-primary-focus',
        className,
      )}
      onClick={onClick}
      {...moreProps}
    >
      <div className='flex items-center gap-2.5'>
        {iconName && <BaseIcon name={iconName} weight='light' size={42} />}
        <span className={cx('text-4xl font-bold', countClassName)}>
          {count}
        </span>
      </div>
      {countLabel && (
        <span className='text-start leading-tight'>{countLabel}</span>
      )}
    </button>
  );
});
