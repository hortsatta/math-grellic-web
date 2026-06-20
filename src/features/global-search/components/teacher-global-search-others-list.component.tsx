import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';
import type { OtherLink } from '../models/global-search.model';

type Props = ComponentProps<'div'> & {
  others: OtherLink[];
  hideTitle: boolean;
};

export const TeacherGlobalSearchOthersList = memo(function ({
  className,
  others,
  hideTitle,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      {...moreProps}
    >
      {!hideTitle && <h3 className='text-lg leading-none'>Others</h3>}
      <div className='flex flex-col'>
        {others.map(({ name, to, label, icon }) => (
          <BaseLink
            key={name}
            to={to}
            className='!w-fit !justify-start pr-2.5'
            leftIconName={icon}
            bodyFont
          >
            {label}
          </BaseLink>
        ))}
      </div>
    </div>
  );
});
