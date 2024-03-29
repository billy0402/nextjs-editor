import { useState } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import LatexIcon from '@/public/images/markdown-editor/latex.svg';
import * as commands from '@uiw/react-md-editor/commands';
import katex from 'katex';
import { Margin, Options, Resolution, usePDF } from 'react-to-pdf';
import rehypeKatex from 'rehype-katex';
import { getCodeString } from 'rehype-rewrite';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkSupersub from 'remark-supersub';
import { PluggableList } from 'unified';

import useThemeDetector from '@/hooks/useThemeDetector';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import 'katex/dist/katex.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);
const Markdown = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
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

const options: Options = {
  // default is `save`
  // method: 'open',
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: Resolution.HIGH,
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.SMALL,
    // default is 'A4'
    // format: 'letter',
    // default is 'portrait'
    // orientation: 'landscape',
  },
  canvas: {
    // default is 'image/jpeg' for better size performance
    mimeType: 'image/jpeg',
    qualityRatio: 1,
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break,
  // so use with caution.
  // overrides: {
  //   // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
  //   pdf: {
  //     compress: true,
  //   },
  //   // see https://html2canvas.hertzen.com/configuration for more options
  //   canvas: {
  //     useCORS: true,
  //     allowTaint: true,
  //   },
  // },
};

const MarkdownEditor = () => {
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

\`console.log('Hello, world!');\`

\`\`\`
console.log('Hello, world!');
\`\`\`

\`\`\`javascript
console.log('Hello, world!');
\`\`\`

\`\`\`javascript showLineNumbers {1,3-4}
console.log('Hello, world!');
console.log('Hello, world!');
console.log('Hello, world!');
console.log('Hello, world!');
console.log('Hello, world!');
\`\`\`

\`\`\`python
print('Hello, world!')!
\`\`\`

---

\`\`\`latex
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`

$$
c = \\pm\\sqrt{a^2 + b^2}
$$

<br />

<a name="old"></a>
<h2 id="current">Current</h2>
<p>Link to <a href="#current">current</a>, link to <a href="#old">old</a>.

<IFRAME SRC=\"javascript:javascript:alert(window.origin);\"></IFRAME>`,
  );

  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

  const isDarkTheme = useThemeDetector();

  return (
    <article style={{ width: '100%' }}>
      <MDEditor
        data-color-mode={isDarkTheme ? 'dark' : 'light'}
        value={textExpression}
        onChange={setTextExpression}
        commands={customCommands}
        height={500}
        visibleDragbar={false}
        previewOptions={{
          remarkPlugins: [
            remarkSupersub,
            remarkMath,
            [remarkGfm, { singleTilde: false }],
          ],
          rehypePlugins: [
            [
              rehypeSanitize,
              {
                ...defaultSchema,
                attributes: {
                  ...defaultSchema.attributes,
                  span: [
                    ...(defaultSchema.attributes?.span ?? []),
                    ['className'],
                    ['line'],
                  ],
                  code: [
                    ...(defaultSchema.attributes?.code ?? []),
                    ['className'],
                  ],
                },
              },
            ],
            rehypeKatex,
          ],
          pluginsFilter: (type: 'rehype' | 'remark', plugin: PluggableList) => {
            console.log(type, plugin);
            return plugin;
          },
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

              // if (Array.isArray(children)) {
              //   return (
              //     <code className={String(className)}>
              //       {children.map((child: React.ReactElement, index) => (
              //         <Fragment key={index}>
              //           {{
              //             ...child,
              //             props: {
              //               ...child.props,
              //               children: [
              //                 <span
              //                   key='span-line-number'
              //                   className='line-number'
              //                   style={{
              //                     width: `${
              //                       children.length.toString().length
              //                     }rem`,
              //                   }}
              //                 >
              //                   {index + 1}
              //                 </span>,
              //                 ...child.props.children,
              //               ],
              //             },
              //           }}
              //         </Fragment>
              //       ))}
              //     </code>
              //   );
              // }

              return <code className={String(className)}>{children}</code>;
            },
          },
        }}
      />
      <article
        ref={targetRef}
        className='w-md-editor-preview w-md-editor-pdf'
        data-color-mode='dark'
      >
        <Markdown source={textExpression} />
      </article>
      <footer className='w-md-editor-footer'>
        <p>
          <span>字數: {textExpression?.length}</span>
          <span>行數: {textExpression?.split('\n').length}</span>
        </p>
      </footer>
      <button className='btn margin-top' type='button' onClick={() => toPDF()}>
        Generate PDF
      </button>
    </article>
  );
};

export default MarkdownEditor;
