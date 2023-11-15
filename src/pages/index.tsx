import CodeEditor from '@/components/CodeEditor';
import { FileTree } from '@/components/FileTree';
import Sidebar from '@/components/Sidebar';
import { Directory, File, Type, findFileByName } from '@/helpers/file-manager';
import useFilesFromSandbox from '@/hooks/useFilesFromSandbox';
import type { NextPage } from 'next';
import { useState } from 'react';

const CURRENT_SANDBOX_ID = 'ww9kis';

const dummyDir: Directory = {
  id: '1',
  name: 'loading...',
  type: Type.DUMMY,
  parentId: undefined,
  depth: 0,
  dirs: [],
  files: [],
};

const HomePage: NextPage = () => {
  const [rootDir, setRootDir] = useState(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  useFilesFromSandbox(CURRENT_SANDBOX_ID, (root) => {
    if (!selectedFile) {
      setSelectedFile(findFileByName(root, 'index.tsx'));
    }
    setRootDir(root);
  });

  const onSelect = (file: File) => setSelectedFile(file);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar>
        <FileTree
          rootDir={rootDir}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      </Sidebar>
      <CodeEditor selectedFile={selectedFile} />
    </div>
  );
};

export default HomePage;
