import type { File } from '@/models/archive';
import { IoIosCloseCircleOutline } from 'react-icons/io';

type Props = {
  files: File[];
  setFiles: (files: File[]) => void;
  setSelectedFile: (value: File | undefined) => void;
};

const Tabs = ({ files, setFiles, setSelectedFile }: Props) => {
  return (
    <ul className='tabs'>
      {files.map((file) => (
        <li
          key={file.id}
          className='tabs__tab'
          onClick={() => setSelectedFile(file)}
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
