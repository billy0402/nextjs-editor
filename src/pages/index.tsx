import { useState } from 'react';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import CodeLayout from '@/components/CodeLayout';
import { capitalize } from '@/helpers/string';
import { File } from '@/models/archive';

const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'));
const AceEditor = dynamic(() => import('@/components/AceEditor'));
const MonacoEditor = dynamic(() => import('@/components/MonacoEditor'));

enum EditorType {
  MARKDOWN = 'MARKDOWN',
  ACE = 'ACE',
  MONACO = 'MONACO',
}

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
            {capitalize(type)} Editor
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
        </CodeLayout>
      )}
    </article>
  );
};

export default HomePage;
