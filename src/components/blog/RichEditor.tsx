import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Undo,
  Redo,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRef } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  userId: string;
}

export function RichEditor({ value, onChange, userId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-6" } }),
      Placeholder.configure({ placeholder: "Start writing your story…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[60vh] focus:outline-none px-2 py-6",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return null;

  const handleImage = async (file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file);
    if (error) {
      alert(error.message);
      return;
    }
    const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
  };

  return (
    <div className="rounded-xl border border-border bg-surface/30">
      <Toolbar editor={editor} onImageClick={() => fileRef.current?.click()} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleImage(f);
          e.target.value = "";
        }}
      />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, onImageClick }: { editor: Editor; onImageClick: () => void }) {
  const Btn = ({
    on,
    active,
    children,
    title,
  }: {
    on: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={on}
      className={`grid h-8 w-8 place-items-center rounded-md transition ${
        active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-border bg-background/80 p-2 backdrop-blur">
      <Btn title="H1" on={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}><Heading1 className="h-4 w-4" /></Btn>
      <Btn title="H2" on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className="h-4 w-4" /></Btn>
      <Btn title="H3" on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 className="h-4 w-4" /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Bold" on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold className="h-4 w-4" /></Btn>
      <Btn title="Italic" on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic className="h-4 w-4" /></Btn>
      <Btn title="Quote" on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote className="h-4 w-4" /></Btn>
      <Btn title="Code" on={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}><Code className="h-4 w-4" /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Bullet list" on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className="h-4 w-4" /></Btn>
      <Btn title="Ordered list" on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className="h-4 w-4" /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn
        title="Link"
        on={() => {
          const url = prompt("URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive("link")}
      >
        <LinkIcon className="h-4 w-4" />
      </Btn>
      <Btn title="Image" on={onImageClick}><ImageIcon className="h-4 w-4" /></Btn>
      <Btn
        title="YouTube/video"
        on={() => {
          const url = prompt("Video URL (YouTube or MP4)");
          if (!url) return;
          const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
          const html = yt
            ? `<div class="my-6 aspect-video"><iframe src="https://www.youtube.com/embed/${yt[1]}" class="h-full w-full rounded-xl" allowfullscreen></iframe></div>`
            : `<video src="${url}" controls class="w-full rounded-xl my-6"></video>`;
          editor.chain().focus().insertContent(html).run();
        }}
      >
        <Youtube className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Undo" on={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></Btn>
      <Btn title="Redo" on={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></Btn>
    </div>
  );
}
