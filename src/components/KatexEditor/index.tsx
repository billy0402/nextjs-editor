import { useState } from 'react';

import Image from 'next/image';

import LatexIcon from '@/public/images/markdown-editor/latex.svg';
import * as commands from '@uiw/react-md-editor/commands';
import katex from 'katex';
import dynamic from 'next/dynamic';
import { getCodeString } from 'rehype-rewrite';

import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import 'katex/dist/katex.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

const commandLatex: commands.ICommand = {
  name: 'title3',
  keyCommand: 'title3',
  buttonProps: { 'aria-label': 'Insert title3' },
  icon: <Image src={LatexIcon} alt='latex' width={16} height={16} />,
  execute: (state: any, api: any) => {
    let modifyText = `\
\`\`\`latex
${state.selectedText}
\`\`\``;
    if (!state.selectedText) {
      modifyText = `\
\`\`\`latex
\`\`\``;
    }
    api.replaceSelection(modifyText);
  },
};

const customCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.group(
    [
      commands.title1,
      commands.title2,
      commands.title3,
      commands.title4,
      commands.title5,
      commands.title6,
    ],
    {
      name: 'title',
      groupName: 'title',
      buttonProps: { 'aria-label': 'Insert title' },
    },
  ),
  commands.divider,

  commands.link,
  commands.quote,
  commands.code,
  commands.codeBlock,
  commands.comment,
  commandLatex,
  commands.image,
  commands.table,
  commands.divider,

  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
  commands.divider,

  commands.help,
];

const KatexEditor = () => {
  const [textExpression, setTextExpression] = useState<string | undefined>(
    `\
# Header

Your content here

**Bold**

_Italic_

~~line cross~~

x~2~

x^2^

> blockauote
> {.is-info}

- item
- item
- item

1. item
2. item
3. item

\`console.log('Hello. world!');\`

\`\`\`
console.log('Hello. world!');
\`\`\`

\`\`\`javascript
console.log('Hello. world!');
\`\`\`

---

\`\`\`latex
c = \\pm\\sqrt{a^2 + b^2}
\`\`\``,
  );

  return (
    <article style={{ width: '100%' }}>
      <MDEditor
        data-color-mode='dark'
        value={textExpression}
        onChange={setTextExpression}
        commands={customCommands}
        height='100%'
        visibleDragbar={false}
        previewOptions={{
          // rehypePlugins: [[rehypeSanitize]],
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
                /^language-latex/.test(className.toLocaleLowerCase())
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
      <footer className='w-md-editor-footer'>
        <p>
          <span>字數: {textExpression?.length}</span>
          <span>行數: {textExpression?.split('\n').length}</span>
        </p>
      </footer>
    </article>
  );
};

export default KatexEditor;
