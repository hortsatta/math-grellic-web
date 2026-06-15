import { memo, useMemo } from 'react';
import cx from 'classix';

import dayjs from '#/config/dayjs.config';
import { BaseButton } from '#/base/components/base-button.components';
import { BaseIcon } from '#/base/components/base-icon.component';
import { BaseSpinner } from '#/base/components/base-spinner.component';

import type { ComponentProps } from 'react';
import type { AnnouncementUpsertFormData } from '../models/announcement-form-data.model';

type Props = ComponentProps<'div'> & {
  formData: AnnouncementUpsertFormData | null;
  fullSize?: boolean;
  hasError?: boolean;
  loading?: boolean;
  onSubmit?: () => void;
  onClick?: () => void;
  onBack?: () => void;
};

export const AnnouncementUpsertPreview = memo(function ({
  className,
  loading,
  formData,
  fullSize,
  hasError,
  onClick,
  onBack,
  onSubmit,
  ...moreProps
}: Props) {
  const [title, description, dateText] = useMemo(
    () => [
      formData?.title,
      formData?.description,
      formData?.startDate &&
        `${dayjs(formData?.startDate)
          .format('MMM DD, YYYY')
          .toUpperCase()} / ${formData?.startTime || '-'}`,
    ],
    [formData],
  );

  return (
    <div
      className={cx('w-full bg-inherit', !!onClick && 'ann-onclick', className)}
      {...moreProps}
    >
      <div className='flex justify-center bg-inherit py-5'>
        <div
          className={cx(
            'group/ann-preview relative flex rounded-xl border-[3px] bg-inherit transition-colors [.ann-onclick_&]:cursor-pointer',
            fullSize ? 'w-full' : 'h-[181px] w-full -2lg:w-[396px]',
            hasError
              ? 'border-red-500 hover:[.ann-onclick_&]:border-red-400'
              : 'border-primary hover:[.ann-onclick_&]:border-primary-focus-light',
            loading &&
              '!pointer-events-none hover:[.ann-onclick_&]:!border-primary',
          )}
          onClick={onClick}
        >
          <div className='absolute -right-[3px] -top-[3px] h-10 w-[52px] overflow-hidden bg-inherit'>
            <BaseIcon
              name='quotes'
              weight='fill'
              size={50}
              className={cx(
                'absolute -right-[5px] -top-[11px] transition-colors',
                hasError
                  ? 'text-red-500 group-hover/ann-preview:[.ann-onclick_&]:text-red-400'
                  : 'text-primary group-hover/ann-preview:[.ann-onclick_&]:text-primary-focus-light',
              )}
            />
          </div>
          <div
            className={cx(
              'flex w-full flex-col justify-between gap-2.5 px-5 py-6',
              loading && 'items-center !justify-center',
            )}
          >
            {loading ? (
              <BaseSpinner />
            ) : (
              <>
                <h4
                  className={cx(
                    'w-full pr-8 font-body text-base font-medium normal-case leading-5 tracking-normal text-accent',
                    formData?.title.trim().length === 0 && 'opacity-60',
                  )}
                >
                  {title || 'Announcement'}
                </h4>
                <p
                  className={cx(
                    'flex-1 font-medium leading-5',
                    !fullSize ? 'line-clamp-3 max-h-16' : 'min-h-[64px]',
                    formData?.description.trim().length === 0 && 'opacity-60',
                  )}
                >
                  {description || 'This is a preview of your announcement.'}
                </p>
                <div
                  className={cx(
                    'w-full text-center',
                    formData ? 'text-sm uppercase' : 'font-medium',
                  )}
                >
                  {formData ? dateText : 'Tap to create an announcement'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='flex w-full flex-col items-center justify-between gap-2.5 -2xs:flex-row'>
        {!!onBack && (
          <BaseButton
            variant='link'
            size='sm'
            leftIconName='arrow-circle-left'
            onClick={onBack}
            disabled={loading}
          >
            Back
          </BaseButton>
        )}
        {!!onSubmit && (
          <BaseButton
            rightIconName='broadcast'
            loading={loading}
            onClick={onSubmit}
          >
            Broadcast
          </BaseButton>
        )}
      </div>
    </div>
  );
});
