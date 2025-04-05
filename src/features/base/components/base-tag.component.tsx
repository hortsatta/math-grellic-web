import { forwardRef, memo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

export const BaseTag = memo(
  forwardRef<HTMLDivElement, ComponentProps<'div'>>(function (
    { className, children, ...moreProps },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx(
          'flex items-center justify-center rounded bg-accent/80 px-4 py-1 text-xs font-medium uppercase tracking-wide text-white',
          className,
        )}
        {...moreProps}
      >
        {children}
      </div>
    );
  }),
);
