import { memo, useCallback, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { EditableMathField } from 'react-mathquill';
import cx from 'classix';

import 'mathquill/build/mathquill.css';

import type { Node } from '@tiptap/pm/model';
import type { MathField } from 'react-mathquill';

type Props = {
  node: Node;
  updateAttributes: (attributes: Record<string, any>) => void;
  getPos: (() => number) | boolean;
};

export const BaseRichTextMathExtension = memo(function ({
  node,
  updateAttributes,
  getPos,
}: Props) {
  const [latex, setLatex] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const handleChange = useCallback(
    (mathField: MathField) => {
      // Pos can sometimes be undefined so check before using updateAttributes
      const pos = typeof getPos === 'boolean' ? getPos : getPos();
      if (!pos) return;

      const value = mathField.latex();
      updateAttributes({ value });
      setLatex(value);
    },
    [updateAttributes, getPos],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setIsEmpty(false);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!latex.trim().length) {
      setIsEmpty(true);
    }
  }, [latex]);

  return (
    <NodeViewWrapper as='span'>
      <EditableMathField
        className={cx(
          'mq-editable-field mq-math-mode m-0.5 rounded border p-0.5',
          isFocused ? 'border-dashed border-primary-focus' : 'border-none',
          !isFocused && isEmpty && '!border-dashed',
        )}
        latex={node.attrs.value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </NodeViewWrapper>
  );
});
