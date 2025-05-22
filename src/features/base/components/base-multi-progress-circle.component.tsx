import { memo, useMemo } from 'react';
import cx from 'classix';

import { BaseCircle } from './base-circle.component';

import type { ComponentProps } from 'react';

type Size = 'sm' | 'base';

type Item = {
  percent: number;
  className?: string;
};

type Props = ComponentProps<'div'> & {
  items: Item[];
  size?: Size;
  backdropCircleClassName?: string;
};

export const BaseMultiProgressCircle = memo(function ({
  className,
  items,
  size = 'base',
  backdropCircleClassName,
  ...moreProps
}: Props) {
  const targetSize = useMemo(() => (size === 'base' ? 104 : 80), [size]);

  const svgSize = useMemo(
    () => ({ width: targetSize, height: targetSize }),
    [targetSize],
  );

  const transformedItems = useMemo(() => {
    const descItems = items.sort(
      (itemA, itemB) => itemA.percent - itemB.percent,
    );

    if (descItems.length <= 1) {
      return descItems;
    }

    let currentPercent = 0;
    const transformedDescItems = descItems.map((item) => {
      if (!item.percent) return item;

      currentPercent += item.percent;

      return {
        ...item,
        percent: currentPercent,
      };
    });

    return transformedDescItems.reverse();
  }, [items]);

  return (
    <div className={cx('relative flex items-center', className)} {...moreProps}>
      <svg {...svgSize}>
        <g className='origin-center' transform='rotate(-90)'>
          <BaseCircle
            className={backdropCircleClassName ?? 'stroke-slate-400'}
            size={targetSize}
          />
          {transformedItems.map((item, index) => (
            <BaseCircle
              key={`pc-${index}`}
              className={cx(item.className ?? 'stroke-primary')}
              percent={item.percent}
              size={targetSize}
              isMultiple
            />
          ))}
        </g>
      </svg>
    </div>
  );
});
