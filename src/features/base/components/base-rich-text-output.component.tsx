import { createElement, forwardRef, memo, useCallback, useMemo } from 'react';
import { StaticMathField } from 'react-mathquill';
import { useController } from 'react-hook-form';
import cx from 'classix';

import { stripHtml } from '#/utils/html.util';

import type { ComponentProps } from 'react';
import type { UseControllerProps } from 'react-hook-form';

type Props = Omit<ComponentProps<'div'>, 'dangerouslySetInnerHTML'> & {
  label: string;
  text: string;
  keyPrefix?: string;
  active?: boolean;
  errorMessage?: string;
  wrapperProps?: ComponentProps<'div'>;
  disabled?: boolean;
};

type ControlledProps = Props & UseControllerProps<any>;

export const BaseRichTextOutput = memo(
  forwardRef<HTMLDivElement, Props>(function (
    {
      className,
      keyPrefix = 'rt',
      label,
      text,
      active,
      errorMessage,
      disabled,
      wrapperProps: { className: wrapperClassName, ...moreWrapperProps } = {},
      ...moreProps
    },
    ref,
  ) {
    const isEmpty = useMemo(() => {
      const result = stripHtml(text);
      return !result.trim().length;
    }, [text]);

    // Convert DOM nodes to react elements
    const createComponent = useCallback((node: any, key: string): any => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();

        // Handle <img> tags as void elements
        if (tagName === 'img') {
          const attributes: any = {};
          for (const { name, value } of node.attributes) {
            attributes[name] = value;
          }
          return <img key={key} {...attributes} />;
        }

        // Handle <span> elements with data-type="inline-math"
        if (
          tagName === 'span' &&
          node.getAttribute('data-type') === 'inline-math'
        ) {
          const value = node.getAttribute('value');
          return (
            <StaticMathField key={key} className='m-0.5 p-0.5'>
              {value}
            </StaticMathField>
          );
        }
        // Recursively process child nodes
        const children = Array.from(node.childNodes).map((child, index) =>
          createComponent(child, `${key}.${index}`),
        );
        // Create a React element for the current node
        const attributes: any = {};
        for (const { name, value } of node.attributes) {
          attributes[name] = value;
        }

        return createElement(
          node.tagName.toLowerCase(),
          { key, ...node.attributes },
          children,
        );
      }

      return null;
    }, []);

    const output = useMemo(() => {
      if (isEmpty) {
        return label;
      }

      // Parse the HTML string into a DOM tree
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      return Array.from(doc.body.childNodes).map((node, index) =>
        createComponent(node, `${keyPrefix}.${index}`),
      );
    }, [keyPrefix, label, text, isEmpty, createComponent]);

    return (
      <div
        className={cx(active && 'w-full', wrapperClassName)}
        {...moreWrapperProps}
      >
        <div
          ref={ref}
          className={cx(
            'rt-output base-rich-text flex min-h-[48px] w-full cursor-text items-center rounded-md border-2 py-2 text-accent',
            active
              ? 'cursor-pointer border-transparent px-0'
              : 'border-accent/40 pl-18px pr-5',
            isEmpty && 'font-medium text-accent/50',
            !!errorMessage && '!border-red-500/60',
            disabled && 'pointer-events-none !bg-backdrop-gray',
            className,
          )}
          {...moreProps}
        >
          <div>{output}</div>
        </div>
        {!!errorMessage && (
          <small className='mt-0.5 inline-block px-1 text-red-500'>
            {errorMessage}
          </small>
        )}
      </div>
    );
  }),
);

export function BaseControlledRichTextOutput(props: ControlledProps) {
  const {
    field: { ...moreFields },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseRichTextOutput
      {...props}
      {...moreFields}
      errorMessage={error?.message}
    />
  );
}
