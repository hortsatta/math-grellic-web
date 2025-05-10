import { memo, useCallback, useMemo } from 'react';
import cx from 'classix';

import { adminRoutes } from '#/app/routes/admin-routes';
import { BaseDataEmptyMessage } from '#/base/components/base-data-empty-message.component';
import {
  TeacherUserSingleCard,
  TeacherUserSingleCardSkeleton,
} from './teacher-user-single-card.component';

import type { ComponentProps } from 'react';
import type { TeacherUserAccount } from '../models/user.model';

type Props = ComponentProps<'div'> & {
  teachers: TeacherUserAccount[];
  loading?: boolean;
  onTeacherDetails?: (teacher: TeacherUserAccount) => void;
  onTeacherEdit?: (id: number) => void;
};

export const TeacherUserList = memo(function ({
  className,
  teachers,
  loading,
  onTeacherDetails,
  onTeacherEdit,
  ...moreProps
}: Props) {
  const isEmpty = useMemo(() => !teachers?.length, [teachers]);

  const handleTeacherDetails = useCallback(
    (teacher: TeacherUserAccount) => () => {
      onTeacherDetails && onTeacherDetails(teacher);
    },
    [onTeacherDetails],
  );

  const handleTeacherEdit = useCallback(
    (id: number) => () => {
      onTeacherEdit && onTeacherEdit(id);
    },
    [onTeacherEdit],
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
          <TeacherUserSingleCardSkeleton key={index} />
        ))
      ) : isEmpty ? (
        <BaseDataEmptyMessage
          message='No teacher available'
          linkLabel='Enroll'
          linkTo={adminRoutes.teacher.createTo}
        />
      ) : (
        teachers.map((teacher, index) => (
          <TeacherUserSingleCard
            key={`s-${teacher.publicId?.toLowerCase() || index}`}
            teacher={teacher}
            onDetails={handleTeacherDetails(teacher)}
            onEdit={handleTeacherEdit(teacher.id)}
            role='row'
          />
        ))
      )}
    </div>
  );
});
