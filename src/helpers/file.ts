export function fileNameToExtension(fileName: string): string {
  return fileName.split('.').pop() || '';
}

export function fileExtensionToLanguage(extension: string): string | undefined {
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return undefined;
  }
}
