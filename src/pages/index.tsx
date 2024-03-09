import CodeLayout from '@/components/CodeLayout';
import MarkdownEditor from '@/components/MarkdownEditor';
import MonacoEditor from '@/components/MonacoEditor';
import { File } from '@/models/archive';
import type { NextPage } from 'next';
import { useState } from 'react';

enum EditorType {
  CODE = 'CODE',
  MARKDOWN = 'MARKDOWN',
}

const HomePage: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [editorType, setEditorType] = useState(EditorType.MARKDOWN);

  return (
    <article style={{ display: 'flex', flexDirection: 'column' }}>
      <ul className='tabs'>
        <li
          className='tabs__tab'
          onClick={() => setEditorType(EditorType.CODE)}
        >
          Code Editor
        </li>
        <li
          className='tabs__tab'
          onClick={() => setEditorType(EditorType.MARKDOWN)}
        >
          Markdown Editor
        </li>
      </ul>
      {editorType === EditorType.CODE && (
        <CodeLayout
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        >
          <MonacoEditor selectedFile={selectedFile} />
        </CodeLayout>
      )}
      {editorType === EditorType.MARKDOWN && <MarkdownEditor />}
    </article>
  );
};

export default HomePage;
