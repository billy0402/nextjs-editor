import { FileTree } from '@/components/FileTree';
import FolderSelect from '@/components/FolderSelect';
import Sidebar from '@/components/Sidebar';
import Tabs from '@/components/Tabs/Tabs';
import { findFileByName } from '@/helpers/file-manager';
import useFilesFromSandbox from '@/hooks/useFilesFromSandbox';
import type { Directory, File } from '@/models/archive';
import { ArchiveType } from '@/models/archive';
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

type Props = {
  selectedFile: File | undefined;
  setSelectedFile: (file: File | undefined) => void;
  children: React.ReactNode;
};

const CodeLayout = ({ selectedFile, setSelectedFile, children }: Props) => {
  const [rootDir, setRootDir] = useState(dummyDir);
  const [files, setFiles] = useState<File[]>([]);

  useFilesFromSandbox(CURRENT_SANDBOX_ID, (root) => {
    if (!selectedFile) {
      const file = findFileByName(root, 'main.js');
      if (!file) return;
      setSelectedFile(file);
      setFiles([file]);
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
          selectedFile={selectedFile}
          setFiles={setFiles}
          setSelectedFile={setSelectedFile}
        />
        <section>{children}</section>
      </article>
    </main>
  );
};

export default CodeLayout;
