import { memo } from 'react';
import cx from 'classix';

import { BaseLink } from '#/base/components/base-link.component';

import type { ComponentProps } from 'react';

export const UserRegisterDone = memo(function ({
  className,
  ...moreProps
}: ComponentProps<'div'>) {
  return (
    <div className={cx('w-full p-1.5', className)} {...moreProps}>
      <div className='flex w-full flex-col items-center px-4 pt-8 xs:block lg:px-11'>
        <h1 className='mb-2 w-full text-center xs:text-left'>
          Sign up complete!
        </h1>
        <p className='mb-8 max-w-xl text-center text-lg xs:text-left'>
          Before accessing the platform, there's one final step.
          <br />
          <br />
          We've sent a confirmation email to your address — please check your
          inbox and follow the link to verify your email. Thank you.
        </p>
        <BaseLink to='/' rightIconName='arrow-circle-right'>
          Return to Home
        </BaseLink>
      </div>
    </div>
  );
});
