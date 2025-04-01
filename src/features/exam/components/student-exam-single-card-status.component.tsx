import { memo, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classix';

import { generateCountdownTime } from '#/utils/time.util';
import { BaseIcon } from '#/base/components/base-icon.component';

import type { ComponentProps } from 'react';
import type { Duration } from 'dayjs/plugin/duration';

type Props = ComponentProps<'div'> & {
  score: number | null;
  ongoingDuration?: Duration | null;
};

export const StudentExamSingleCardStatus = memo(function ({
  score,
  ongoingDuration,
  ...moreProps
}: Props) {
  const countdown = useRef<any>(null);
  const [duration, setDuration] = useState<Duration | null>(null);

  useEffect(() => {
    // Sync local duration from server duration
    setDuration(ongoingDuration || null);
    // Reset interval and continue countdown
    clearInterval(countdown.current);
    countdown.current = setInterval(
      () => setDuration((prev) => prev?.subtract(1000, 'ms') || null),
      1000,
    );

    return () => {
      clearInterval(countdown.current);
    };
  }, [ongoingDuration]);

  const [ongoingCountdown, hasHours] = useMemo(() => {
    if (!duration) {
      return [null, null];
    }
    return [generateCountdownTime(duration), !!duration.hours()];
  }, [duration]);

  return (
    <div {...moreProps}>
      {ongoingCountdown ? (
        <div className='flex items-center gap-x-2'>
          <div
            className={cx(
              'rounded bg-red-500 px-4 text-lg text-white',
              hasHours ? 'w-[105px]' : 'w-20',
            )}
          >
            {ongoingCountdown}
          </div>
          <div className='relative flex justify-center'>
            <div className='absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white' />
            {score == null ? (
              <BaseIcon
                name='clock-countdown'
                weight='fill'
                size={44}
                className='relative z-10 text-red-500'
              />
            ) : (
              <BaseIcon
                name='check-circle'
                weight='fill'
                size={44}
                className='relative z-10 text-green-500'
              />
            )}
          </div>
        </div>
      ) : (
        <div className='relative flex w-20 justify-center'>
          <div className='absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 bg-white' />
          {score == null ? (
            <BaseIcon
              name='x-circle'
              weight='fill'
              size={44}
              className='relative z-10 text-red-500'
            />
          ) : (
            <BaseIcon
              name='check-circle'
              weight='fill'
              size={44}
              className='relative z-10 text-green-500'
            />
          )}
        </div>
      )}
    </div>
  );
});
