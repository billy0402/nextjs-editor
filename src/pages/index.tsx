import CodeEditor from '@/components/CodeEditor';
import { FileTree } from '@/components/FileTree';
import FolderSelect from '@/components/FolderSelect';
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
  type: ArchiveType.DUMMY,
  depth: 0,
  parentId: undefined,
  readOnly: false,
  dirs: [],
  files: [],
};

const HomePage: NextPage = () => {
  const [rootDir, setRootDir] = useState(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);

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
    <div style={{ display: 'flex' }}>
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
    </div>
  );
};

export default HomePage;
