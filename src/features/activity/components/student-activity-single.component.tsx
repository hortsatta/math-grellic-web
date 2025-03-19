import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import cx from 'classix';

import {
  scoreShowItemVariants,
  scoreShowVariants,
} from '#/utils/animation.util';
import { stripHtml } from '#/utils/html.util';
import { generateOrdinalSuffix } from '#/utils/string.util';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseRichTextOutput } from '#/base/components/base-rich-text-output.component';
import { PerformanceRankAwardImg } from '#/performance/components/performance-rank-award-img.component';
import { ActivityGameLoader } from './activity-game-loader.component';

import type { ComponentProps } from 'react';
import { type Activity, ActivityCategoryType } from '../models/activity.model';

type Props = ComponentProps<'div'> & {
  activity: Activity;
  loading?: boolean;
  preview?: boolean;
};

export const StudentActivitySingle = memo(function ({
  className,
  loading,
  activity,
  preview,
}: Props) {
  const [startActivity, setStartActivity] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocalLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const [gameType, score, rank, description] = useMemo(
    () => [
      activity.game.type,
      activity.score,
      activity.rank,
      activity.description || '',
    ],
    [activity],
  );

  const scoreSuffix = useMemo(() => {
    const targetScore = score || 0;

    if (gameType === ActivityCategoryType.Point) {
      return targetScore > 1 ? 'Points' : 'Point';
    } else if (gameType === ActivityCategoryType.Time) {
      return targetScore > 1 ? 'Seconds' : 'Second';
    } else {
      return targetScore > 1 ? 'Levels' : 'Level';
    }
  }, [score, gameType]);

  const rankText = useMemo(
    () => (rank == null ? '-' : generateOrdinalSuffix(rank)),
    [rank],
  );

  const isEmpty = useMemo(() => {
    const result = stripHtml(description);
    return !result.trim().length;
  }, [description]);

  const handleStartActivity = useCallback(() => setStartActivity(true), []);

  return (
    <div className={cx('flex w-full flex-col items-center', className)}>
      {localLoading || loading ? (
        <div className='flex h-full w-full flex-1 items-center justify-center'>
          <BaseSpinner />
        </div>
      ) : (
        <>
          {!startActivity ? (
            <motion.div
              className='flex w-full max-w-compact flex-col items-center gap-y-8 p-4'
              variants={scoreShowVariants}
              initial='hidden'
              animate='show'
            >
              {score != null && (
                <BaseSurface className='!p-5' rounded='sm'>
                  <h3 className='text-base'>Current rank and score</h3>
                  <motion.div
                    className='flex items-center justify-center gap-5 px-5 pb-6 pt-8 text-primary-hue-teal'
                    variants={scoreShowItemVariants}
                  >
                    <div className='flex items-center gap-x-2.5'>
                      <span className='text-[40px] font-bold'>{rankText}</span>
                      {rank != null && rank <= 10 && (
                        <PerformanceRankAwardImg rank={rank} size='lg' />
                      )}
                    </div>
                    <BaseDivider className='!h-14' vertical />
                    <div className='flex items-center gap-2.5 font-display text-4xl font-medium tracking-tighter'>
                      <span>{score}</span>
                      <span>{scoreSuffix}</span>
                    </div>
                  </motion.div>
                </BaseSurface>
              )}
              {!isEmpty && (
                <div className='w-full'>
                  <BaseDivider />
                  <div className='base-rich-text rt-output w-full py-5'>
                    <BaseRichTextOutput
                      className='border-0 p-0'
                      label='Description'
                      text={description}
                      unboxed
                    />
                  </div>
                  <BaseDivider />
                </div>
              )}
              <BaseButton rightIconName='play' onClick={handleStartActivity}>
                Start Activity
              </BaseButton>
            </motion.div>
          ) : (
            <ActivityGameLoader className='mx-auto' activity={activity} />
          )}
        </>
      )}
    </div>
  );
});
