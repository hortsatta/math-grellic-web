import { memo, useMemo } from 'react';
import cx from 'classix';

import { getVideoId } from '#/utils/video.util';

import type { ComponentProps } from 'react';

const VITE_YOUTUBE_EMBED_BASE_URL = import.meta.env.VITE_YOUTUBE_EMBED_BASE_URL;

type Props = ComponentProps<'div'> & {
  url: string;
  title?: string;
};

export const LessonVideo = memo(function ({
  className,
  url,
  title,
  ...moreProps
}: Props) {
  // Since youtube url from db is either embed or watch url,
  // extract video id and apply embed url
  const videoSrc = useMemo(
    () =>
      `${VITE_YOUTUBE_EMBED_BASE_URL}/${getVideoId(
        url,
      )}?rel=0&modestbranding=1`,
    [url],
  );

  return (
    <div
      className={cx(
        'h-[500px] w-full overflow-hidden rounded-lg bg-black',
        className,
      )}
      {...moreProps}
    >
      <iframe
        className='mx-auto h-full w-full max-w-static-full'
        src={videoSrc}
        allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        title={title || 'Lesson Video'}
        allowFullScreen
      />
    </div>
  );
});
