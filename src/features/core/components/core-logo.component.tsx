import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { BaseTooltip } from '#/base/components/base-tooltip.component';

import logoPng from '#/assets/images/logo.png';

import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Link> & {
  isExpanded?: boolean;
};

const logoStyle = {
  backgroundImage: `url(${logoPng})`,
  backgroundSize: '214px 37px',
  backgroundPositionX: 'left',
};

export const CoreLogo = memo(function ({
  className,
  isExpanded,
  ...moreProps
}: Props) {
  return (
    <Link
      className={cx(
        'inline-flex w-full items-center py-1 pl-4 transition-all hover:brightness-110',
        className,
      )}
      {...moreProps}
    >
      <BaseTooltip content={isExpanded ? '' : 'Math Grellic'} placement='right'>
        <div
          style={logoStyle}
          className={cx(
            'h-[37px] w-12 transition-[width] duration-200',
            isExpanded && '!w-[214px]',
          )}
        />
      </BaseTooltip>
    </Link>
  );
});
