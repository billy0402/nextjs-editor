import useThemeDetector from '@/hooks/useThemeDetector';
import type { File } from '@/models/archive';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ selectedFile }: { selectedFile: File | undefined }) => {
  const isDarkTheme = useThemeDetector();

  if (!selectedFile) return null;

  const code = selectedFile.content;
  let language = selectedFile.name.split('.').pop();

  if (language === 'js' || language === 'jsx') language = 'javascript';
  else if (language === 'ts' || language === 'tsx') language = 'typescript';

  return (
    <div style={{ fontSize: 16 }}>
      <Editor
        height='100vh'
        language={language}
        value={code}
        theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
        options={{ readOnly: selectedFile.readOnly }}
      />
    </div>
  );
};

export default CodeEditor;
