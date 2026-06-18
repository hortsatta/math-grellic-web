import { memo } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classix';

import { studentHelpBaseRoute } from '#/help/route/student-help-handle.route';
import { BaseSurface } from '#/base/components/base-surface.component';

import helpBg from '#/assets/images/help-bg.png';
import helpTeacher from '#/assets/images/help-teacher.png';

import type { ComponentProps } from 'react';

export const StudentDashboardHelpCard = memo(function ({
  className,
  ...moreProps
}: ComponentProps<typeof BaseSurface>) {
  return (
    <Link to={studentHelpBaseRoute} className='group'>
      <BaseSurface
        className={cx(
          'relative flex min-h-[310px] flex-col justify-between gap-4 overflow-hidden transition-[border] md:min-h-[341px] md:gap-0',
          'group-hover:!border-primary-focus group-hover:ring-primary-focus group-hover:drop-shadow-primary md:[.rsb-expanded_&]:min-h-[310px] xl:[.rsb-expanded_&]:min-h-[341px]',
          className,
        )}
        {...moreProps}
      >
        <div className='relative z-10 w-10/12 md:w-full md:bg-white/70 -2lg:bg-none 1.5xl:w-96 xl:[.rsb-expanded_&]:bg-white/70 1.5xl:[.rsb-expanded_&]:bg-none'>
          <h3 className='mb-2.5 text-lg leading-none'>Help & Support</h3>
          <span className='[.rsb-expanded_&]:lg inline-block'>
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
              className='h-[174px] w-full object-cover md:h-full md:[.rsb-expanded_&]:h-[174px] xl:[.rsb-expanded_&]:h-full'
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
