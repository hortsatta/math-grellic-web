import { memo, useMemo } from 'react';
import cx from 'classix';

import { generateOrdinalSuffix } from '#/utils/string.util';
import { studentUserBaseRoute } from '#/user/route/current-user-handle.route';
import { studentPerformanceBaseRoute } from '#/performance/route/student-performance-handle.route';
import { BaseDivider } from '#/base/components/base-divider.component';
import { BaseLink } from '#/base/components/base-link.component';
import { BaseSurface } from '#/base/components/base-surface.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { PerformanceRankAwardImg } from '#/performance/components/performance-rank-award-img.component';
import { DashboardUserWelcome } from './dashboard-user-welcome.component';

import type { ComponentProps } from 'react';
import type { User } from '#/user/models/user.model';
import type { StudentPerformance } from '#/performance/models/performance.model';

type Props = ComponentProps<typeof BaseSurface> & {
  user: User | null;
  studentPerformance?: StudentPerformance | null;
  loading?: boolean;
};

export const StudentDashboardUserSummary = memo(function ({
  className,
  loading,
  user,
  studentPerformance,
  ...moreProps
}: Props) {
  const [overallRank, overallRankText, overallScore] = useMemo(
    () => [
      studentPerformance?.overallExamRank,
      studentPerformance?.overallExamRank == null
        ? '-'
        : generateOrdinalSuffix(studentPerformance.overallExamRank),
      studentPerformance?.overallExamScore,
    ],
    [studentPerformance],
  );

  const overallScoreText = useMemo(() => {
    if (overallScore == null) {
      return '';
    }

    const pointText = overallScore > 1 ? 'Points' : 'Point';
    return `${overallScore} ${pointText}`;
  }, [overallScore]);

  return (
    <BaseSurface
      className={cx(
        'flex w-full gap-4',
        loading ? 'items-center justify-center' : 'items-stretch',
        className,
      )}
      {...moreProps}
    >
      {!performance || loading ? (
        <BaseSpinner />
      ) : (
        <div className='flex w-full animate-fastFadeIn flex-col gap-4'>
          {user && (
            <DashboardUserWelcome to={studentUserBaseRoute} user={user} />
          )}
          <BaseDivider />
          <div className='flex flex-col gap-4'>
            <div>
              <h3 className='text-lg'>Overall Rank</h3>
              <span className='text-sm'>Your current position among peers</span>
            </div>
            <div className='flex min-w-[230px] flex-col items-center justify-center gap-1 font-bold text-primary -3xs:flex-row -3xs:gap-5 md:flex-col md:gap-1 -2lg:flex-row -2lg:gap-5 xl:[.rsb-expanded_&]:flex-col xl:[.rsb-expanded_&]:gap-1 1.5xl:[.rsb-expanded_&]:flex-row 1.5xl:[.rsb-expanded_&]:gap-5'>
              <div className='flex items-center gap-x-2.5'>
                <span className='text-4xl'>{overallRankText}</span>
                {overallRank != null && overallRank <= 10 && (
                  <PerformanceRankAwardImg rank={overallRank} />
                )}
              </div>
              {!!overallScore && (
                <>
                  <BaseDivider
                    className='hidden !h-10 -3xs:inline-block md:hidden -2lg:inline-block xl:[.rsb-expanded_&]:hidden 1.5xl:[.rsb-expanded_&]:inline-block'
                    vertical
                  />
                  <span className='font-display text-2xl tracking-tighter'>
                    {overallScoreText}
                  </span>
                </>
              )}
            </div>
            <BaseLink
              to={studentPerformanceBaseRoute}
              rightIconName='arrow-circle-right'
              size='xs'
            >
              Detailed View
            </BaseLink>
          </div>
        </div>
      )}
    </BaseSurface>
  );
});
