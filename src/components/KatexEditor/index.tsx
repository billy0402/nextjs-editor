import { useEffect, useRef, useState } from 'react';

import katex from 'katex';

const KatexEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [textExpression, setTextExpression] = useState(
    'c = \\pm\\sqrt{a^2 + b^2}',
  );

  useEffect(() => {
    if (!containerRef?.current) return;
    katex.render(textExpression, containerRef.current, {
      throwOnError: false,
    });
  }, [textExpression]);

  return (
    <article style={{ display: 'flex', flexWrap: 'wrap' }}>
      <textarea
        style={{ flex: 1, minWidth: '500px' }}
        value={textExpression}
        onChange={(e) => setTextExpression(e.target.value)}
      />
      <div ref={containerRef} style={{ flex: 1, minWidth: '500px' }} />
    </article>
  );
};

export default KatexEditor;
