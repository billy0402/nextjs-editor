import { openDirectory } from '@/helpers/open-directory';
import type { Directory } from '@/models/archive';
import { ArchiveType } from '@/models/archive';

type Result = { result: Item[] } & Partial<Record<string, { result: Item[] }>>;

type Item = {
  id: string;
  name: string;
  type: ArchiveType;
  depth: number;
  path: string;
  dirs: Item[];
  files: Item[];
  file: File | undefined;
  content: string | undefined;
  children: Item[];
};

const filePathsToTree = (filePaths: string[], files: File[]) => {
  let final = { result: [] as Item[] };

  for (const path of filePaths) {
    let context: Result = final as Result;

    path.split('/').forEach((name, index) => {
      if (!context[name]) {
        context[name] = { result: [] as Item[] };

        const fullPath = path
          .split('/')
          .slice(0, index + 1)
          .join('/');
        const file = files.find((file) => file.webkitRelativePath === fullPath);

        context.result.push({
          id: Math.random().toString(),
          name,
          type:
            context[name]!.result.length > 0
              ? ArchiveType.FILE
              : ArchiveType.DIRECTORY,
          depth: index + 1,
          path: fullPath,
          dirs: context[name]!.result,
          files: context[name]!.result,
          file,
          content: undefined && file?.text(),
          children: context[name]!.result,
        });
      }

      context = context[name] as Result;
    });
  }

  return final.result;
};

type Props = {
  setRootDir: (value: Directory) => void;
  setSelectedFile: (value: File | undefined) => void;
};

const FolderSelect = ({ setRootDir, setSelectedFile }: Props) => {
  return (
    <input
      type='file'
      multiple
      // @ts-ignore
      webkitdirectory
      directory
      onClick={async () => {
        const files = await openDirectory();
        const filePaths: string[] = files.map(
          (file: File) => file.webkitRelativePath,
        );
        const tree = filePathsToTree(filePaths, files);
        console.log(tree);

        setRootDir(tree[0] as any);
      }}
    />
  );
};

export default FolderSelect;
