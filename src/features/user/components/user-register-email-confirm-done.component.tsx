import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';

const title = import.meta.env.VITE_META_TITLE;

type Props = ComponentProps<'div'> & {
  publicId: string | null;
  isConfirmed: boolean;
};

export const UserRegisterEmailConfirmDone = memo(function ({
  className,
  publicId,
  isConfirmed,
  ...moreProps
}: Props) {
  return (
    <div className={cx('w-full p-1.5', className)} {...moreProps}>
      <div className='flex w-full flex-col items-center px-4 pt-8 xs:block lg:px-11'>
        <h1 className='mb-2 w-full text-center xs:text-left'>
          {isConfirmed ? 'Email confirmed!' : 'Email confirmation failed'}
        </h1>
        <p className='mb-8 max-w-xl text-center text-lg xs:text-left'>
          {isConfirmed ? (
            <>
              Your email has been successfully verified and your account has
              been approved, you can now access the {title} app.
              <br />
              <br />
              Your id is <b>{publicId}</b>. Welcome aboard!
            </>
          ) : (
            'The email confirmation link is either invalid or has expired. Please request a new confirmation email and try again.'
          )}
        </p>
        <BaseLink to='/' rightIconName='arrow-circle-right'>
          Return to Home
        </BaseLink>
      </div>
    </div>
  );
});
