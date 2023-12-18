import { arrayMove } from '@/helpers/array';
import type { File } from '@/models/archive';
import { useRef, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

type Props = {
  files: File[];
  setFiles: (files: File[]) => void;
  setSelectedFile: (value: File | undefined) => void;
};

const Tabs = ({ files, setFiles, setSelectedFile }: Props) => {
  const listRef = useRef<HTMLUListElement>(null);

  const [startDrag, setStartDrag] = useState<string>();

  return (
    <ul ref={listRef} className='tabs'>
      {files.map((file) => (
        <li
          key={file.id}
          className='tabs__tab'
          onClick={() => setSelectedFile(file)}
          draggable
          onDragStart={(e) => {
            setStartDrag((e.target as HTMLElement).innerText);
          }}
          onDragOver={(e) => {
            const endDrag = (e.target as HTMLElement).innerText;

            if (!startDrag || !endDrag || startDrag === endDrag) return;

            const copyFiles = [...files];
            const oldIndex = files.findIndex(
              (_file) => _file.fullPath === startDrag,
            );
            const newIndex = files.findIndex(
              (_file) => _file.fullPath === endDrag,
            );
            const newFiles = arrayMove<typeof copyFiles>(
              copyFiles,
              oldIndex,
              newIndex,
            );
            setFiles(newFiles);
            setSelectedFile(newFiles[newIndex]);
          }}
        >
          {file.fullPath}
          <a
            onClick={(e) => {
              e.stopPropagation();

              const removedFiles = files.filter(
                (_file) => _file.id !== file.id,
              );
              setFiles(removedFiles);

              if (removedFiles.length > 0) {
                setSelectedFile(removedFiles[removedFiles.length - 1]);
              }
            }}
          >
            <IoIosCloseCircleOutline />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
