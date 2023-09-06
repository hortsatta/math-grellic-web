import { memo } from 'react';

import { BaseStaticScene } from '#/base/components/base-static-scene.component';
import { HomeSection1 } from '#/static/components/home-section-1.component';
import { HomeSection2 } from '#/static/components/home-section-2.component';
import { HomeSection3 } from '#/static/components/home-section-3.component';
import { HomeSection4 } from '#/static/components/home-section-4.component';
import { HomeSection5 } from '#/static/components/home-section-5.component';

export const HomePage = memo(function () {
  return (
    <BaseStaticScene>
      <HomeSection1 className='pt-20' />
      <HomeSection2 className='mb-44' />
      <HomeSection3 className='mb-44' />
      <HomeSection4 className='mb-36' />
      <HomeSection5 />
    </BaseStaticScene>
  );
});