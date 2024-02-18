import CodeEditor from '@/components/CodeEditor';
import { FileTree } from '@/components/FileTree';
import FolderSelect from '@/components/FolderSelect';
import KatexEditor from '@/components/KatexEditor';
import Sidebar from '@/components/Sidebar';
import Tabs from '@/components/Tabs/Tabs';
import { findFileByName } from '@/helpers/file-manager';
import useFilesFromSandbox from '@/hooks/useFilesFromSandbox';
import type { Directory, File } from '@/models/archive';
import { ArchiveType } from '@/models/archive';
import type { NextPage } from 'next';
import { useState } from 'react';

const CURRENT_SANDBOX_ID = 'ww9kis';

const dummyDir: Directory = {
  id: '1',
  name: 'loading...',
  fullPath: '',
  type: ArchiveType.DUMMY,
  depth: 0,
  parentId: undefined,
  readOnly: false,
  dirs: [],
  files: [],
};

enum EditorType {
  CODE = 'CODE',
  MARKDOWN = 'MARKDOWN',
}

const HomePage: NextPage = () => {
  const [rootDir, setRootDir] = useState(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [editorType, setEditorType] = useState(EditorType.CODE);

  useFilesFromSandbox(CURRENT_SANDBOX_ID, (root) => {
    if (!selectedFile) {
      setSelectedFile(findFileByName(root, 'index.tsx'));
    }
    setRootDir(root);

    if (selectedFile && !files.find((file) => file.id === selectedFile.id)) {
      setFiles([...files, selectedFile]);
    }
  });

  const onSelect = (file: File) => {
    setSelectedFile(file);

    if (file && !files.find((_file) => _file.id === file.id)) {
      setFiles([...files, file]);
    }
  };

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
        <main style={{ display: 'flex' }}>
          <Sidebar>
            <FolderSelect
              setRootDir={setRootDir}
              // @ts-ignore
              setSelectedFile={setSelectedFile}
            />
            <FileTree
              rootDir={rootDir}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          </Sidebar>
          <article className='code-container'>
            <Tabs
              files={files}
              setFiles={setFiles}
              setSelectedFile={setSelectedFile}
            />
            <CodeEditor selectedFile={selectedFile} />
          </article>
        </main>
      )}
      {editorType === EditorType.MARKDOWN && <KatexEditor />}
    </article>
  );
};

export default HomePage;
