import { ArchiveType, Directory, File } from '@/models/archive';

/**
 * 建立文件樹
 * @param data fetch取得的結果
 */
export function buildFileTree(data: any): Directory {
  const dirs = [...data.directories]; // 目錄數組
  const files = [...data.modules]; // 檔案數組
  const cache = new Map<string, Directory | File>(); // 快取
  // 待建置的根目錄
  let rootDir: Directory = {
    id: '0',
    name: 'root',
    fullPath: '',
    type: ArchiveType.DIRECTORY,
    depth: 0,
    parentId: undefined,
    readOnly: false,
    dirs: [],
    files: [],
  };
  // 將<id，目錄物件>存入map
  dirs.forEach((item) => {
    let dir: Directory = {
      id: item.shortid,
      name: item.title,
      fullPath: item.title,
      type: ArchiveType.DIRECTORY,
      depth: 0,
      parentId: item.directory_shortid === null ? '0' : item.directory_shortid,
      readOnly: false,
      dirs: [],
      files: [],
    };

    cache.set(dir.id, dir);
  });
  // 將<id，文件物件>存入map
  files.forEach((item) => {
    let file: File = {
      id: item.shortid,
      name: item.title,
      fullPath: item.title,
      type: ArchiveType.FILE,
      depth: 0,
      parentId: item.directory_shortid === null ? '0' : item.directory_shortid,
      readOnly: false,
      content: item.code,
    };
    cache.set(file.id, file);
  });
  // 開始遍歷建立檔案樹
  cache.forEach((value, key) => {
    // '0'表示檔案或目錄位於根目錄
    if (value.parentId === '0') {
      if (value.type === ArchiveType.DIRECTORY)
        rootDir.dirs.push(value as Directory);
      else rootDir.files.push(value as File);
    } else {
      const parentDir = cache.get(value.parentId as string) as Directory;
      if (value.type === ArchiveType.DIRECTORY)
        parentDir.dirs.push(value as Directory);
      else parentDir.files.push(value as File);
    }
  });

  // 取得檔案深度
  getDepth(rootDir, 0);

  return rootDir;
}

/**
 * 取得文件深度
 * @param rootDir 根目錄
 * @param curDepth 目前深度
 */
function getDepth(rootDir: Directory, curDepth: number) {
  rootDir.files.forEach((file) => {
    file.depth = curDepth + 1;
  });
  rootDir.dirs.forEach((dir) => {
    dir.depth = curDepth + 1;
    getDepth(dir, curDepth + 1);
  });
}

export function findFileByName(
  rootDir: Directory,
  filename: string,
): File | undefined {
  let targetFile: File | undefined = undefined;

  function findFile(rootDir: Directory, filename: string) {
    rootDir.files.forEach((file) => {
      if (file.name === filename) {
        targetFile = file;
        return;
      }
    });
    rootDir.dirs.forEach((dir) => {
      findFile(dir, filename);
    });
  }

  findFile(rootDir, filename);
  return targetFile;
}

export function sortDir(l: Directory, r: Directory) {
  return l.name.localeCompare(r.name);
}

export function sortFile(l: File, r: File) {
  return l.name.localeCompare(r.name);
}
