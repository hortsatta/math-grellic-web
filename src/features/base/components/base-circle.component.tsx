import { memo, useMemo } from 'react';
import cx from 'classix';

import type { ComponentProps } from 'react';

type Props = ComponentProps<'circle'> & {
  size: number;
  percent?: number;
  isMultiple?: boolean;
};

const STROKE_WIDTH = 12;

export const BaseCircle = memo(
  ({ className, percent, size, isMultiple, ...moreProps }: Props) => {
    const r = useMemo(() => size / 2 - STROKE_WIDTH / 2, [size]);

    const strokeDasharray = useMemo(() => 2 * Math.PI * r, [r]);

    const strokeDashoffset = useMemo(
      () => (percent ? ((100 - percent) * strokeDasharray) / 100 : 0),
      [percent, strokeDasharray],
    );

    return (
      <circle
        className={cx(className, percent ? '' : 'opacity-30')}
        r={r}
        cx='50%'
        cy='50%'
        fill='transparent'
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap={isMultiple ? 'butt' : 'round'}
        {...moreProps}
      />
    );
  },
);
