import { memo, useMemo } from 'react';
import cx from 'classix';

import { ActivityGame } from '../models/activity.model';

import type { ComponentProps } from 'react';
import type { Activity } from '../models/activity.model';

const angryBirdsPath = import.meta.env.VITE_ACTGAME_ANGRY_BIRDS_PATH;
const basketballPath = import.meta.env.VITE_ACTGAME_BASKETBALL_PATH;
const carRacingPath = import.meta.env.VITE_ACTGAME_CAR_RACING_PATH;
const slidePuzzlePath = import.meta.env.VITE_ACTGAME_SLIDE_PUZZLE_PATH;
const escapeRoomPath = import.meta.env.VITE_ACTGAME_ESCAPE_ROOM_PATH;

type Props = ComponentProps<'div'> & {
  activity: Activity;
};

const gameSrc = {
  [ActivityGame.AngryBirds as string]: angryBirdsPath,
  [ActivityGame.Basketball as string]: basketballPath,
  [ActivityGame.CarRacing as string]: carRacingPath,
  [ActivityGame.SlidePuzzle as string]: slidePuzzlePath,
  [ActivityGame.EscapeRoom as string]: escapeRoomPath,
};

export const ActivityGameLoader = memo(function ({
  className,
  activity,
  ...moreProps
}: Props) {
  const gameName = useMemo(() => activity.game.name, [activity]);

  return (
    <div
      className={cx(
        'w-full max-w-static-full overflow-hidden rounded-lg',
        className,
      )}
      {...moreProps}
    >
      {gameName && (
        <iframe className='aspect-video w-full' src={gameSrc[gameName]} />
      )}
    </div>
  );
});
