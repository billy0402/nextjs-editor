import Editor from '@uiw/react-codemirror';

import { javascript } from '@codemirror/lang-javascript';

import { fileExtensionToLanguage, fileNameToExtension } from '@/helpers/file';
import useThemeDetector from '@/hooks/useThemeDetector';
import type { File } from '@/models/archive';

type Props = {
  selectedFile: File | undefined;
};

const extensions = [javascript({ jsx: true })];

const CodeMirrorEditor = ({ selectedFile }: Props) => {
  const isDarkTheme = useThemeDetector();

  if (!selectedFile) return null;

  const fileExtension = fileNameToExtension(selectedFile.name);
  const language = fileExtensionToLanguage(fileExtension);

  return (
    <Editor
      value={selectedFile?.content}
      height='100vh'
      lang={language}
      extensions={extensions}
      theme={isDarkTheme ? 'dark' : 'light'}
      readOnly={selectedFile.readOnly}
    />
  );
};

export default CodeMirrorEditor;
