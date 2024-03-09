import { useState } from 'react';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import CodeLayout from '@/components/CodeLayout';
import { File } from '@/models/archive';
import { EditorType, editorTypeDisplay } from '@/models/editor-type';

const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'));
const AceEditor = dynamic(() => import('@/components/AceEditor'));
const MonacoEditor = dynamic(() => import('@/components/MonacoEditor'));
const CodeMirrorEditor = dynamic(() => import('@/components/CodeMirrorEditor'));

const editorTypes = Object.values(EditorType);

const HomePage: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [editorType, setEditorType] = useState(EditorType.MARKDOWN);

  return (
    <article style={{ display: 'flex', flexDirection: 'column' }}>
      <ul className='tabs'>
        {editorTypes.map((type) => (
          <li
            key={type}
            className={`tabs__tab${editorType === type ? ' active' : ''}`}
            onClick={() => setEditorType(type)}
          >
            {editorTypeDisplay[type]}
          </li>
        ))}
      </ul>
      {editorType === EditorType.MARKDOWN && <MarkdownEditor />}
      {editorType !== EditorType.MARKDOWN && (
        <CodeLayout
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        >
          {editorType === EditorType.ACE && (
            <AceEditor selectedFile={selectedFile} />
          )}
          {editorType === EditorType.MONACO && (
            <MonacoEditor selectedFile={selectedFile} />
          )}
          {editorType === EditorType.CODE_MIRROR && (
            <CodeMirrorEditor selectedFile={selectedFile} />
          )}
        </CodeLayout>
      )}
    </article>
  );
};

export default HomePage;
