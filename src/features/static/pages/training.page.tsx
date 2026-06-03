import DOMPurify from 'dompurify';

import { BaseStaticScene } from '#/base/components/base-static-scene.component';

import trainingContent from '../content/training-content.json';

const section1ContentHtml = {
  __html: DOMPurify.sanitize(trainingContent.section1.content),
};

export function TrainingPage() {
  return (
    <BaseStaticScene>
      <section className='mx-auto mb-24 flex w-full max-w-static-full flex-col items-center px-4 lg:mb-36'>
        <h2 className='mb-7'>{trainingContent.section1.title}</h2>
        <div
          className='text-justify text-lg'
          dangerouslySetInnerHTML={section1ContentHtml}
        />
      </section>
    </BaseStaticScene>
  );
}
