import { stripHtml as stringStripHtml } from 'string-strip-html';

export function stripHtml(
  html: string,
  onEmpty?: () => void,
  onInvalidQuestion?: () => void,
  onInvalidImage?: () => void,
): string {
  const { result } = stringStripHtml(html || '', {
    cb: ({ tag, deleteFrom, deleteTo, insert, rangesArr }) => {
      if (tag) {
        switch (tag.name) {
          case 'span': {
            let value = insert;

            const isInlineMath = tag.attributes.some(
              (attr) =>
                attr.name === 'data-type' && attr.value === 'inline-math',
            );

            if (isInlineMath) {
              value = tag.attributes.find((attr) => attr.name === 'value')
                ?.value;

              if (!value?.trim().length) {
                onInvalidQuestion && onInvalidQuestion();
              }
            }

            rangesArr.push(deleteFrom || 0, deleteTo || undefined, value);
            break;
          }
          case 'img': {
            const src: any = tag.attributes.find((attr) => attr.name === 'src');

            if (!src?.value.trim().length) {
              onInvalidImage && onInvalidImage();
            }

            rangesArr.push(deleteFrom || 0, deleteTo || undefined, 'img');
            break;
          }
          default:
            rangesArr.push(deleteFrom || 0, deleteTo || undefined, insert);
            break;
        }
      } else {
        // default action which does nothing different from normal, non-callback operation
        rangesArr.push(deleteFrom || 0, deleteTo || undefined, insert);
      }
    },
  });

  if (!result.trim().length) {
    onEmpty && onEmpty();
  }

  return result;
}

export function hasImage(htmls: string[]): boolean {
  return htmls.some((html) => html.includes('<img'));
}

export function getImageSrcs(html: string): string[] {
  // Parse the HTML string into a DOM document
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Query for all <img> elements
  const elements = doc.querySelectorAll('img');
  // Extract the `src` attribute from each <img> element
  const srcs = Array.from(elements).map((img) => img.getAttribute('src') || '');
  return srcs.filter((src) => src.trim().length);
}

export function replaceImageSrcs(
  html: string,
  srcs: string[],
  baseUrl?: string,
): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Query for all <img> elements
  const elements = doc.querySelectorAll('img');
  // Replace the `src` attribute of each <img> element with values from the targetSrcs array
  elements.forEach((img, index) => {
    if (srcs[index]) {
      img.setAttribute('src', `${baseUrl}${srcs[index]}?${Date.now()}`);
    }
  });
  // Serialize the updated DOM back into an HTML string
  const serializer = new XMLSerializer();
  return serializer
    .serializeToString(doc.body)
    .replace(/<body[^>]*>|<\/body>/g, '')
    .trim();
}
