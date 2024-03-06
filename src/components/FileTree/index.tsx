import { getIcon } from '@/components/Icon';
import { sortDir, sortFile } from '@/helpers/file-manager';
import useThemeDetector from '@/hooks/useThemeDetector';
import type { Directory, File } from '@/models/archive';
import React, { useState } from 'react';

type FileTreeProps = {
  rootDir: Directory; // 根目錄
  selectedFile: File | undefined; // 目前選取文件
  onSelect: (file: File) => void; // 更改選取時觸發事件
};

export const FileTree = (props: FileTreeProps) => {
  return <SubTree directory={props.rootDir} {...props} />;
};

type SubTreeProps = {
  directory: Directory; // 根目錄
  selectedFile: File | undefined; // 目前選取文件
  onSelect: (file: File) => void; // 更改選取時觸發事件
};

const SubTree = (props: SubTreeProps) => {
  return (
    <div>
      {props.directory.dirs.sort(sortDir).map((dir) => (
        <React.Fragment key={dir.id}>
          <DirDiv
            directory={dir}
            selectedFile={props.selectedFile}
            onSelect={props.onSelect}
          />
        </React.Fragment>
      ))}
      {props.directory.files.sort(sortFile).map((file) => (
        <React.Fragment key={file.id}>
          <FileDiv
            file={file}
            selectedFile={props.selectedFile}
            onClick={() => props.onSelect(file)}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

const FileDiv = ({
  file,
  icon,
  selectedFile,
  onClick,
}: {
  file: File | Directory; // 目前文件
  icon?: string; // 圖示名稱
  selectedFile: File | undefined; // 選取的文件
  onClick: () => void; // 點選事件
}) => {
  const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
  const depth = file.depth;
  const isDarkTheme = useThemeDetector();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: depth * 16,
        backgroundColor: isSelected
          ? isDarkTheme
            ? '#242424'
            : '#ededed'
          : 'transparent',
        cursor: 'pointer',
        // ':hover': {
        //   cursor: 'pointer',
        //   backgroundColor: '#242424',
        // },
      }}
      onClick={onClick}
    >
      <FileIcon name={icon} extension={file.name.split('.').pop() || ''} />
      <span style={{ marginLeft: 1 }}>{file.name}</span>
    </div>
  );
};

const DirDiv = ({
  directory,
  selectedFile,
  onSelect,
}: {
  directory: Directory; // 目前目錄
  selectedFile: File | undefined; // 選取的文件
  onSelect: (file: File) => void; // 點選事件
}) => {
  let defaultOpen = false;
  if (selectedFile) defaultOpen = isChildSelected(directory, selectedFile);
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <FileDiv
        file={directory}
        icon={open ? 'openDirectory' : 'closedDirectory'}
        selectedFile={selectedFile}
        onClick={() => setOpen(!open)}
      />
      {open ? (
        <SubTree
          directory={directory}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      ) : null}
    </>
  );
};

const isChildSelected = (directory: Directory, selectedFile: File) => {
  let res: boolean = false;

  function isChild(dir: Directory, file: File) {
    if (selectedFile.parentId === dir.id) {
      res = true;
      return;
    }
    if (selectedFile.parentId === '0') {
      res = false;
      return;
    }
    dir.dirs.forEach((item) => {
      isChild(item, file);
    });
  }

  isChild(directory, selectedFile);
  return res;
};

const FileIcon = ({
  extension,
  name,
}: {
  name?: string;
  extension?: string;
}) => {
  let icon = getIcon(extension || '', name || '');
  return (
    <span
      style={{
        display: 'flex',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icon}
    </span>
  );
};
