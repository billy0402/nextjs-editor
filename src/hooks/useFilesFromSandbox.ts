import { fakeFiles } from '@/fixtures/fake-files';
import { buildFileTree } from '@/helpers/file-manager';
import type { Directory } from '@/models/archive';
import { useEffect } from 'react';

const useFilesFromSandbox = (
  id: string,
  callback: (dir: Directory) => void,
) => {
  useEffect(() => {
    callback(fakeFiles);
    return;

    fetch('https://codesandbox.io/api/v1/sandboxes/' + id)
      .then((response) => response.json())
      .then(({ data }) => {
        const rootDir = buildFileTree(data);
        callback(rootDir);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useFilesFromSandbox;
