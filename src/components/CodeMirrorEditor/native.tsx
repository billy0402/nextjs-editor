import { useEffect, useRef } from 'react';

import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';

import type { File } from '@/models/archive';

type Props = {
  selectedFile: File | undefined;
};

const CodeMirrorEditor = ({ selectedFile }: Props) => {
  const editor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = EditorState.create({
      doc: selectedFile?.content,
      extensions: [keymap.of(defaultKeymap)],
    });

    const view = new EditorView({
      state,
      parent: editor.current ?? undefined,
      extensions: [basicSetup, javascript()],
    });

    return () => {
      view.destroy();
    };
  }, [selectedFile?.content]);

  return <div ref={editor} />;
};

export default CodeMirrorEditor;
