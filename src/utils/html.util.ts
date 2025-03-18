import ky from 'ky';
import { stripHtml as stringStripHtml } from 'string-strip-html';
import isBase64 from 'validator/lib/isBase64';
import isURL from 'validator/lib/isURL';

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

export function hasImage(value: string | string[]): boolean {
  return typeof value === 'string'
    ? value.includes('<img')
    : value.some((html) => html.includes('<img'));
}

export async function getImageSrcs(html: string): Promise<string[]> {
  // Parse the HTML string into a DOM document
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Query for all <img> elements
  const elements = doc.querySelectorAll('img');
  // Extract the `src` attribute from each <img> element
  const srcs = Array.from(elements).map((img) => img.getAttribute('src') || '');
  // Trim and convert url srcs (if present) to base64
  const convertedSrcs = await Promise.all(
    srcs.map(async (src): Promise<string | null> => {
      if (isBase64(src.split(',').pop() || '')) {
        return src;
      } else if (isURL(src)) {
        try {
          const buffer = await ky.get(src).arrayBuffer();
          const blob = new Blob([buffer], { type: 'image/avif' });

          return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
              resolve(reader.result as string);
            };

            reader.onerror = () => {
              reject(new Error('Failed to read the file.'));
            };

            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error(`Error fetching ${src}`);
          return null;
        }
      }

      return null;
    }),
  );

  return convertedSrcs.filter((src) => src?.trim().length) as string[];
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
  elements.length &&
    elements.forEach((img, index) => {
      if (srcs[index]) {
        img.setAttribute('src', `${baseUrl || ''}${srcs[index]}`);
      }
    });

  // Serialize the updated DOM back into an HTML string
  const serializer = new XMLSerializer();
  return serializer
    .serializeToString(doc.body)
    .replace(/<body[^>]*>|<\/body>/g, '')
    .trim();
}

export function attachCompleteImageSrcs(
  html: string,
  baseUrl?: string,
  withTimestamp?: boolean,
) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // Query for all <img> elements
  const elements = doc.querySelectorAll('img');

  // Append img src values with complete url
  elements.length &&
    elements.forEach((img) => {
      const path = img.getAttribute('src');
      const value = withTimestamp
        ? `${baseUrl}${path}?${Date.now()}`
        : `${baseUrl}${path}`;

      img.setAttribute('src', value);
    });

  // Serialize the updated DOM back into an HTML string
  const serializer = new XMLSerializer();
  return serializer
    .serializeToString(doc.body)
    .replace(/<body[^>]*>|<\/body>/g, '')
    .trim();
}
