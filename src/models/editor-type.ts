export enum EditorType {
  MARKDOWN = 'MARKDOWN',
  ACE = 'ACE',
  MONACO = 'MONACO',
  CODE_MIRROR = 'CODE_MIRROR',
}

export const editorTypeDisplay = {
  [EditorType.MARKDOWN]: 'Markdown Editor',
  [EditorType.ACE]: 'Ace Editor',
  [EditorType.MONACO]: 'Monaco Editor',
  [EditorType.CODE_MIRROR]: 'Code Mirror Editor',
};
