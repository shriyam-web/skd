// components/TiptapEditor.jsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import "./tiptap.css";

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, BulletList, OrderedList, ListItem],
    content: "<p>Start writing here...</p>",
  });

  const addStyle = (type) => {
    if (!editor) return;
    editor.chain().focus()[type]().run();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Rich Text Editor</h2>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => addStyle("toggleBold")} className="btn">
          Bold
        </button>
        <button onClick={() => addStyle("toggleItalic")} className="btn">
          Italic
        </button>
        <button onClick={() => addStyle("toggleUnderline")} className="btn">
          Underline
        </button>
        <button onClick={() => addStyle("toggleBulletList")} className="btn">
          Bullet List
        </button>
        <button onClick={() => addStyle("toggleOrderedList")} className="btn">
          Ordered List
        </button>
        <button
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          className="btn"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 rounded p-3 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
