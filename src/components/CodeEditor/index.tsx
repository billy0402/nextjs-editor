import type { File } from '@/models/archive';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ selectedFile }: { selectedFile: File | undefined }) => {
  if (!selectedFile) return null;

  const code = selectedFile.content;
  let language = selectedFile.name.split('.').pop();

  if (language === 'js' || language === 'jsx') language = 'javascript';
  else if (language === 'ts' || language === 'tsx') language = 'typescript';

  return (
    <div
      style={{
        width: 'calc(100% - 250px)',
        margin: 0,
        fontSize: 16,
      }}
    >
      <Editor height='100vh' language={language} value={code} theme='vs-dark' />
    </div>
  );
};

export default CodeEditor;
