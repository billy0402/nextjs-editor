export enum ArchiveType {
  FILE = 'file', // 文件
  DIRECTORY = 'directory', // 目錄
  DUMMY = 'dummy', // 虛擬檔案（用於未成功取得到檔案時展示）
}

type Archive = {
  id: string; // 文件id
  name: string; // 名稱
  type: ArchiveType; // 檔案類型
  depth: number; // 檔案深度
  parentId?: string; // 父目錄，如果為根目錄則undefined
};

export type Directory = Archive & {
  dirs: Directory[]; // 子目錄
  files: File[]; // 子檔案
};

export type File = Archive & {
  content: string; // 檔案內容
};
