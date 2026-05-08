import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from 'react-loading';
import { useColorMode } from "../utils/darkModeUtils";
import { Markdown } from "./markdown";
import { client } from "../main";
import { headersWithAuth } from "../utils/auth";

interface MarkdownEditorProps {
  content: string;
  setContent: (content: string) => void;
  placeholder?: string;
  height?: string;
}

export function MarkdownEditor({ content, setContent, placeholder = "> Write your content here...", height = "400px" }: MarkdownEditorProps) {
  const { t } = useTranslation();
  const colorMode = useColorMode();
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [preview, setPreview] = useState<'edit' | 'preview' | 'comparison'>('edit');
  const [uploading, setUploading] = useState(false);

  function uploadImage(file: File, onSuccess: (url: string) => void, showAlert: (msg: string) => void) {
    client.storage.index
      .post(
        {
          key: file.name,
          file: file,
        },
        {
          headers: headersWithAuth(),
        }
      )
      .then(({ data, error }) => {
        if (error) {
          showAlert(t("upload.failed"));
        }
        if (data) {
          onSuccess(data);
        }
      })
      .catch((e: any) => {
        console.error(e);
        showAlert(t("upload.failed"));
      });
  }

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = event.clipboardData;
    if (clipboardData.files.length === 1) {
      const editor = editorRef.current;
      if (!editor) return;
      editor.trigger(undefined, "undo", undefined);
      setUploading(true);
      const myfile = clipboardData.files[0] as File;
      uploadImage(myfile, (url) => {
        const selection = editor.getSelection();
        if (!selection) return;
        editor.executeEdits(undefined, [{
          range: selection,
          text: `![${myfile.name}](${url})\n`,
        }]);
        setUploading(false);
      }, (msg) => console.error(msg));
    }
  };

  function UploadImageButton() {
    const uploadRef = useRef<HTMLInputElement>(null);
    
    const upChange = (event: any) => {
      for (let i = 0; i < event.currentTarget.files.length; i++) {
        const file = event.currentTarget.files[i];
        if (file.size > 5 * 1024000) {
          alert("File too large (max 5MB)");
          uploadRef.current!.value = "";
        } else {
          const editor = editorRef.current;
          if (!editor) return;
          const selection = editor.getSelection();
          if (!selection) return;
          setUploading(true);
          uploadImage(file, (url) => {
            setUploading(false);
            editor.executeEdits(undefined, [{
              range: selection,
              text: `![${file.name}](${url})\n`,
            }]);
          }, (msg) => console.error(msg));
        }
      }
    };
    
    return (
      <button onClick={() => uploadRef.current?.click()}>
        <input
          ref={uploadRef}
          onChange={upChange}
          className="hidden"
          type="file"
          accept="image/gif,image/jpeg,image/jpg,image/png"
        />
        <i className="ri-image-add-line" />
      </button>
    );
  }

  return (
    <div className="flex flex-col mx-4 my-2 md:mx-0 md:my-0 gap-2">
      <div className="flex flex-row space-x-2 glass-subtle p-2">
        <button className={`${preview === 'edit' ? "bg-white/90 dark:bg-slate-800/90 text-theme shadow-light" : "t-secondary"} rounded-full px-4 py-2 text-sm font-medium bg-button`} onClick={() => setPreview('edit')}> {t("edit")} </button>
        <button className={`${preview === 'preview' ? "bg-white/90 dark:bg-slate-800/90 text-theme shadow-light" : "t-secondary"} rounded-full px-4 py-2 text-sm font-medium bg-button`} onClick={() => setPreview('preview')}> {t("preview")} </button>
        <button className={`${preview === 'comparison' ? "bg-white/90 dark:bg-slate-800/90 text-theme shadow-light" : "t-secondary"} rounded-full px-4 py-2 text-sm font-medium bg-button`} onClick={() => setPreview('comparison')}> {t("comparison")} </button>
        <div className="flex-grow" />
        {uploading &&
          <div className="flex flex-row space-x-2 items-center">
            <Loading type="spin" color="#0A84FF" height={16} width={16} />
            <span className="text-sm t-secondary">{t('uploading')}</span>
          </div>
        }
      </div>
      <div className={`grid grid-cols-1 ${preview === 'comparison' ? "sm:grid-cols-2" : ""}`}>
        <div className={"flex flex-col " + (preview === 'preview' ? "hidden" : "")}>
          <div className="flex flex-row justify-start mb-2">
            <div className="ios-pill text-sm">
              <UploadImageButton />
            </div>
          </div>
          <div
            className={"relative overflow-hidden rounded-[24px] border border-white/60 dark:border-slate-700/60"}
            onDrop={(e) => {
              e.preventDefault();
              const editor = editorRef.current;
              if (!editor) return;
              for (let i = 0; i < e.dataTransfer.files.length; i++) {
                const selection = editor.getSelection();
                if (!selection) return;
                const file = e.dataTransfer.files[i];
                setUploading(true);
                uploadImage(file, (url) => {
                  setUploading(false);
                  editor.executeEdits(undefined, [{
                    range: selection,
                    text: `![${file.name}](${url})\n`,
                  }]);
                }, (msg) => console.error(msg));
              }
            }}
            onPaste={handlePaste}
          >
            <Editor
              onMount={(editor, _) => {
                editorRef.current = editor;
              }}
              height={height}
              defaultLanguage="markdown"
              className=""
              value={content}
              onChange={(data, _) => {
                setContent(data ?? "");
              }}
              theme={colorMode === "dark" ? "vs-dark" : "light"}
              options={{
                wordWrap: "on",
                fontSize: 14,
                lineNumbers: "off",
                dragAndDrop: true,
                pasteAs: { enabled: false }
              }}
            />
          </div>
        </div>
        <div
          className={"px-6 py-4 overflow-y-scroll glass-subtle " + (preview !== 'edit' ? "" : "hidden")}
          style={{ height: height }}
        >
          <Markdown content={content ? content : placeholder} />
        </div>
      </div>
    </div>
  );
}
