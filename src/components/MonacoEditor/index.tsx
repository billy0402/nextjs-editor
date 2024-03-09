import Editor from '@monaco-editor/react';

import { fileExtensionToLanguage, fileNameToExtension } from '@/helpers/file';
import useThemeDetector from '@/hooks/useThemeDetector';
import type { File } from '@/models/archive';

type Props = {
  selectedFile: File | undefined;
};

const MonacoEditor = ({ selectedFile }: Props) => {
  const isDarkTheme = useThemeDetector();

  if (!selectedFile) return null;

  const code = selectedFile.content;
  const fileExtension = fileNameToExtension(selectedFile.name);
  const language = fileExtensionToLanguage(fileExtension);

  return (
    <Editor
      theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
      language={language}
      value={code}
      height='100vh'
      options={{ fontSize: 16, readOnly: selectedFile.readOnly }}
    />
  );
};

export default MonacoEditor;
