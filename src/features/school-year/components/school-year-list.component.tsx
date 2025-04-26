import { memo, useMemo, useCallback } from 'react';
import cx from 'classix';

import { adminRoutes } from '#/app/routes/admin-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  SchoolYearSingleCard,
  SchoolYearSingleCardSkeleton,
} from './school-year-single-card.component';

import type { ComponentProps } from 'react';
import type { SchoolYear } from '../models/school-year.model';

type Props = ComponentProps<'div'> & {
  schoolYears: SchoolYear[];
  loading?: boolean;
  onSchoolYearDetails?: (slug: string) => void;
  onSchoolYearEdit?: (slug: string) => void;
};

export const SchoolYearList = memo(function ({
  className,
  schoolYears,
  loading,
  onSchoolYearDetails,
  onSchoolYearEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !schoolYears?.length, [schoolYears]);

  const handleSchoolYearDetails = useCallback(
    (slug: string) => () => {
      onSchoolYearDetails && onSchoolYearDetails(slug);
    },
    [onSchoolYearDetails],
  );

  const handleSchoolYearEdit = useCallback(
    (slug: string) => () => {
      onSchoolYearEdit && onSchoolYearEdit(slug);
    },
    [onSchoolYearEdit],
  );

  return (
    <div
      className={cx(
        'flex w-full flex-1 flex-col gap-2.5 self-stretch',
        className,
      )}
      role='table'
      {...moreProps}
    >
      {loading ? (
        [...Array(4)].map((_, index) => (
          <SchoolYearSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No school years available'
          linkTo={adminRoutes.schoolYear.createTo}
        />
      ) : (
        schoolYears.map((schoolYear) => (
          <SchoolYearSingleCard
            key={schoolYear.id}
            schoolYear={schoolYear}
            isActive={schoolYear.isActive}
            onDetails={handleSchoolYearDetails(schoolYear.slug)}
            onEdit={handleSchoolYearEdit(schoolYear.slug)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
