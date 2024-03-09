import CodeLayout from '@/components/CodeLayout';
import MarkdownEditor from '@/components/MarkdownEditor';
import MonacoEditor from '@/components/MonacoEditor';
import { capitalize } from '@/helpers/string';
import { File } from '@/models/archive';
import type { NextPage } from 'next';
import { useState } from 'react';

enum EditorType {
  MARKDOWN = 'MARKDOWN',
  CODE = 'CODE',
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
          <MonacoEditor selectedFile={selectedFile} />
        </CodeLayout>
      )}
    </article>
  );
};

export default HomePage;
