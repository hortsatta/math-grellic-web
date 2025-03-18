import { memo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useController } from 'react-hook-form';
import cx from 'classix';

import { InlineMath } from '#/config/tiptap.config';
import { BaseAdvancedRichTextEditorMenubar } from './base-advanced-rich-text-editor-menubar.component';

import type { ComponentProps } from 'react';
import type { Content } from '@tiptap/react';
import type { UseControllerProps } from 'react-hook-form';

type Props = Omit<ComponentProps<'div'>, 'onChange'> & {
  label?: string;
  initialValue?: Content;
  value?: string;
  imageData?: string;
  errorMessage?: string;
  scrollbarsClassName?: string;
  small?: boolean;
  disabled?: boolean;
  imageInputProps?: ComponentProps<'input'>;
  onChange?: (value: string) => void;
  close?: () => void;
};

export const BaseAdvancedRichTextEditor = memo(function ({
  className,
  initialValue,
  value,
  label,
  imageData,
  errorMessage,
  scrollbarsClassName,
  small,
  disabled,
  onChange,
  imageInputProps,
  close,
  ...moreProps
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({ placeholder: label }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({ allowBase64: true, inline: true }),
      InlineMath,
    ],
    editorProps: {
      attributes: {
        class: 'base-rich-text h-full w-full outline-0',
      },
    },
    content: initialValue,
    onUpdate: ({ editor }) => {
      !!onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  // If using a controlled field, clear content if current value is empty
  useEffect(() => {
    if (value?.trim().length) {
      return;
    }

    editor?.commands.clearContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className='w-full'>
      <div
        className={cx(
          'w-full rounded-md border-2 border-accent/40 bg-white',
          !!errorMessage && '!border-red-500/60',
          disabled && '!bg-backdrop-gray',
          className,
        )}
        {...moreProps}
      >
        {!!editor && (
          <BaseAdvancedRichTextEditorMenubar
            editor={editor}
            disabled={disabled}
            imageData={imageData}
            imageInputProps={imageInputProps}
            closeEditor={close}
          />
        )}
        <OverlayScrollbarsComponent
          className={cx(
            'w-full p-18px',
            small ? 'h-40' : 'h-60',
            scrollbarsClassName,
          )}
          defer
        >
          <EditorContent
            editor={editor}
            className={cx('h-full w-full', disabled && 'pointer-events-none')}
            disabled={disabled}
          />
        </OverlayScrollbarsComponent>
      </div>
      {!!errorMessage && (
        <small className='inline-block px-1 text-red-500'>{errorMessage}</small>
      )}
    </div>
  );
});

export function BaseControlledAdvancedRichTextEditor(
  props: Props & UseControllerProps<any>,
) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController(props);

  return (
    <BaseAdvancedRichTextEditor
      {...props}
      initialValue={value}
      value={value}
      errorMessage={error?.message}
      onChange={onChange}
    />
  );
}
