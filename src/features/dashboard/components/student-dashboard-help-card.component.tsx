import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { studentBaseRoute, studentRoutes } from '#/app/routes/student-routes';
import { BaseSurface } from '#/base/components/base-surface.component';

import helpBg from '#/assets/images/help-bg.png';
import helpTeacher from '#/assets/images/help-teacher.png';

import type { ComponentProps } from 'react';

const HELP_PATH = `/${studentBaseRoute}/${studentRoutes.help.to}`;

type Props = ComponentProps<typeof BaseSurface> & {
  isRightSidebarExpanded?: boolean;
};

export const StudentDashboardHelpCard = memo(function ({
  className,
  isRightSidebarExpanded,
  ...moreProps
}: Props) {
  return (
    <Link to={HELP_PATH} className='group'>
      <BaseSurface
        className={cx(
          'relative flex min-h-[310px] flex-col justify-between gap-4 overflow-hidden transition-[border] md:min-h-[341px] md:gap-0',
          'group-hover:!border-primary-focus group-hover:ring-primary-focus group-hover:drop-shadow-primary',
          isRightSidebarExpanded && 'md:min-h-[310px] xl:min-h-[341px]',
          className,
        )}
        {...moreProps}
      >
        <div className='w-10/12 md:w-full 1.5xl:w-96'>
          <h3 className='mb-2.5 text-lg leading-none'>Help & Support</h3>
          <span className={cx('inline-block', isRightSidebarExpanded && 'lg')}>
            Need help? We are here to provide you with the assistance you need
            to make the most of your learning experience.
          </span>
        </div>
        <div>
          <div className='overflow-hidden rounded-b-xl border border-accent/70'>
            <img
              src={helpBg}
              alt='help background'
              width={395}
              height={170}
              className={cx(
                'h-[174px] w-full object-cover md:h-full',
                isRightSidebarExpanded && 'md:h-[174px] xl:h-full',
              )}
            />
          </div>
          <img
            src={helpTeacher}
            alt='help teacher'
            width={106}
            height={214}
            className='absolute bottom-0 right-12 transition-transform duration-300 group-hover:-translate-y-2.5 group-hover:scale-110 -2xs:right-14'
          />
        </div>
      </BaseSurface>
    </Link>
  );
});
