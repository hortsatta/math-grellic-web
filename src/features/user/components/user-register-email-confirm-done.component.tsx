import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  isConfirmed: boolean;
};

export const UserRegisterEmailConfirmDone = memo(function ({
  className,
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
          {isConfirmed
            ? "Your email has been successfully verified. Your account is now under review, and you'll receive an email notification once it's approved and ready for full access."
            : 'The email confirmation link is either invalid or has expired. Please request a new confirmation email and try again.'}
        </p>
        <BaseLink to='/' rightIconName='arrow-circle-right'>
          Return to Home
        </BaseLink>
      </div>
    </div>
  );
});
