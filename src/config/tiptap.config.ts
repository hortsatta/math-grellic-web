import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';

import { BaseRichTextMathExtension } from '#/base/components/base-rich-text-math-extension';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineMath: {
      /**
       * Comments will be added to the autocomplete.
       */
      addInlineMath: (attributes?: {
        value: string;
        language?: string;
      }) => ReturnType;
    };
  }
}

export const InlineMath = Node.create({
  name: 'inline-math',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return { value: { default: '' } };
  },

  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BaseRichTextMathExtension);
  },

  addCommands() {
    return {
      addInlineMath:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs,
          }),
    };
  },
});
