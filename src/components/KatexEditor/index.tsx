import { useState } from 'react';

import katex from 'katex';
import dynamic from 'next/dynamic';
import { getCodeString } from 'rehype-rewrite';
import rehypeSanitize from 'rehype-sanitize';

import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import 'katex/dist/katex.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

const KatexEditor = () => {
  const [textExpression, setTextExpression] = useState<string | undefined>(
    `\
\`\`\`KaTex
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
    `,
  );

  return (
    <article data-color-mode='dark' style={{ width: '100%' }}>
      <MDEditor
        value={textExpression}
        onChange={setTextExpression}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
          components: {
            code: ({
              inline,
              children = [],
              className,
              ...props
            }: {
              inline: any;
              children?: never[] | undefined;
              className: string;
              [x: string]: any;
            }) => {
              const txt: string = children[0] || '';
              if (inline) {
                if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                  const html = katex.renderToString(
                    txt.replace(/^\$\$(.*)\$\$/, '$1'),
                    {
                      throwOnError: false,
                    },
                  );
                  return <code dangerouslySetInnerHTML={{ __html: html }} />;
                }
                return <code>{txt}</code>;
              }
              const code =
                props.node && props.node.children
                  ? getCodeString(props.node.children)
                  : txt;
              if (
                typeof code === 'string' &&
                typeof className === 'string' &&
                /^language-katex/.test(className.toLocaleLowerCase())
              ) {
                const html = katex.renderToString(code, {
                  throwOnError: false,
                });
                return (
                  <code
                    style={{ fontSize: '150%' }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }
              return <code className={String(className)}>{children}</code>;
            },
          },
        }}
      />
    </article>
  );
};

export default KatexEditor;
