import Editor from 'react-ace';

import type { File } from '@/models/archive';

import { fileExtensionToLanguage, fileNameToExtension } from '@/helpers/file';
import useThemeDetector from '@/hooks/useThemeDetector';

import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-github_dark';

type Props = {
  selectedFile: File | undefined;
};

const AceEditor = ({ selectedFile }: Props) => {
  const isDarkTheme = useThemeDetector();

  if (!selectedFile) return null;

  const fileExtension = fileNameToExtension(selectedFile.name);
  const language = fileExtensionToLanguage(fileExtension);

  return (
    <Editor
      name={selectedFile.id}
      theme={isDarkTheme ? 'github_dark' : 'github'}
      mode={language}
      value={selectedFile.content}
      width='100%'
      height='100vh'
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
      readOnly={selectedFile.readOnly}
    />
  );
};

export default AceEditor;
