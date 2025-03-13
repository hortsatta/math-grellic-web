import { memo } from 'react';

import { BaseModal } from '#/base/components/base-modal.component';
import { LessonVideo } from './lesson-video.component';

import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof BaseModal> & {
  videoUrl: string;
  title: string;
};

export const LessonVideoPreviewModal = memo(function ({
  videoUrl,
  title,
  ...moreProps
}: Props) {
  return (
    <BaseModal {...moreProps}>
      <LessonVideo url={videoUrl} title={title} />
    </BaseModal>
  );
});
