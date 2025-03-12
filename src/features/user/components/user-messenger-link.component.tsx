import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';
import { BaseIcon } from '#/base/components/base-icon.component';

const VITE_MESSENGER_BASE_URL = import.meta.env.VITE_MESSENGER_BASE_URL;

type Props = Omit<ComponentProps<typeof BaseLink>, 'to'> & {
  userId?: string;
  isLight?: boolean;
};

export const UserMessengerLink = memo(function ({
  className,
  children,
  userId,
  isLight,
  ...moreProps
}: Props) {
  const linkClassName = useMemo(() => {
    if (!userId || !userId.length) {
      return '!pointer-events-none !bg-accent/40 !text-white';
    }

    return isLight ? '!bg-white !text-blue-400' : '!bg-blue-500 !text-white';
  }, [userId, isLight]);

  const to = useMemo(
    () => (userId ? `${VITE_MESSENGER_BASE_URL}/${userId}` : '/'),
    [userId],
  );

  return (
    <BaseLink
      className={cx('!h-auto py-1.5', linkClassName, className)}
      variant='solid'
      target='_blank'
      to={to}
      size='xs'
      {...moreProps}
    >
      <BaseIcon name='messenger-logo' weight='fill' size={22} />
      {children || 'Message Me'}
    </BaseLink>
  );
});
