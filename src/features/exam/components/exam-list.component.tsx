import { memo } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cx from 'classix';

import { BaseSearchInput } from '#/base/components/base-search-input.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';
import { ExamSingleItem } from './exam-single-item.component';

import type { ComponentProps } from 'react';
import type { Exam } from '../models/exam.model';

type Props = ComponentProps<'div'> & {
  exams: Exam[];
  onSearchChange: (value: string | null) => void;
  loading?: boolean;
};

export const ExamList = memo(function ({
  className,
  loading,
  exams,
  onSearchChange,
  ...moreProps
}: Props) {
  return (
    <div
      className={cx('flex flex-col items-center justify-between', className)}
      {...moreProps}
    >
      <div className='w-full overflow-hidden'>
        <div className='px-4'>
          <BaseSearchInput
            placeholder='Find an exam'
            onChange={onSearchChange}
            fullWidth
          />
        </div>
        <div className='relative h-[450px] w-full'>
          {loading && (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <BaseSpinner />
            </div>
          )}
          <OverlayScrollbarsComponent
            className='my-2 h-[450px] w-full px-4'
            defer
          >
            <ul className={cx('w-full', loading && 'opacity-50')}>
              {(exams as Exam[]).map((exam) => (
                <li
                  key={exam.id}
                  className='w-full border-b border-primary-border-light py-2 last:border-b-0'
                >
                  <ExamSingleItem exam={exam} />
                </li>
              ))}
            </ul>
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </div>
  );
});
