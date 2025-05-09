import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseSurface } from '#/base/components/base-surface.component';

import type { ComponentProps } from 'react';
import type { AdminUserAccount } from '../models/user.model';

type Props = ComponentProps<typeof BaseSurface> & {
  userAccount: AdminUserAccount;
};

const FIELD_TITLE_CLASSNAME = 'mb-2.5 text-base';

const FIELD_VALUE_CLASSNAME = 'pl-2';

export const AdminUserAccountSingle = memo(function ({
  className,
  userAccount,
  ...moreProps
}: Props) {
  const aboutMe = useMemo(() => userAccount.aboutMe, [userAccount]);

  return (
    <BaseSurface
      className={cx('flex flex-col gap-4', className)}
      rounded='sm'
      {...moreProps}
    >
      <div>
        <h3 className={FIELD_TITLE_CLASSNAME}>About Me</h3>
        <p className={cx(!aboutMe && FIELD_VALUE_CLASSNAME)}>
          {aboutMe || '—'}
        </p>
      </div>
    </BaseSurface>
  );
});
