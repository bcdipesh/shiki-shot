"use client";

import { useState, useEffect, useRef } from "react";
import {
  bundledThemesInfo,
  bundledLanguagesInfo,
  BundledTheme,
  BundledLanguage,
} from "shiki";
import html2canvas from "html2canvas";
import { toast } from "sonner";

import { getSingletonHighlighter } from "@/lib/shiki-highlighter";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

export function ShikiShotEditor() {
  const [theme, setTheme] = useState<BundledTheme>("vitesse-dark");
  const [lang, setLang] = useState<BundledLanguage>("typescript");
  const [input, setInput] = useState("// Type your code here");
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const codeEditorContainerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (codeRef.current && codeEditorContainerRef.current) {
      const preEl = codeRef.current.children[0] as HTMLPreElement;

      if (preEl) {
        codeEditorContainerRef.current.style.backgroundColor =
          preEl.style.backgroundColor;
      }
    }

    const highlightCode = async () => {
      const highlighterInstance = await getSingletonHighlighter();
      const highlighted = highlighterInstance.codeToHtml(input, {
        lang,
        theme,
      });
      setHighlightedCode(highlighted);
    };

    highlightCode();
  }, [input, lang, theme]);

  const captureCodeSnapshot = async () => {
    if (!codeRef.current) return;

    const codeCanvas = await html2canvas(codeRef.current);
    const codeSnapshot = codeCanvas.toDataURL("image/png");

    const image = new Image();
    image.src = codeSnapshot;
    image.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, 0, 0);

      try {
        const blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error())),
            "image/png",
          ),
        );
        const data = [new ClipboardItem({ "image/png": blob })];
        await navigator.clipboard.write(data);
        toast("Code snapshot copied to clipboard!");
      } catch (error) {
        toast(`Failed to copy code snapshot to clipboard: ${error}`);
        console.error("Failed to copy code snapshot to clipboard:", error);
      }
    };
  };

  const handleScroll = () => {
    if (!codeRef.current || !editorRef.current) {
      return;
    }

    const preEl = codeRef.current.children[0] as HTMLPreElement;

    if (!preEl) {
      return;
    }

    preEl.scrollLeft = editorRef.current.scrollLeft;
    preEl.scrollTop = editorRef.current.scrollTop;
  };

  return (
    <div className="my-10 flex flex-col gap-10">
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Theme Selector */}
        <Combobox
          options={bundledThemesInfo.map((theme) => ({
            value: theme.id,
            label: theme.displayName,
          }))}
          selectedValue={{ value: theme, label: "Vitesse Dark" }}
          onValueChange={(value) => setTheme(value as BundledTheme)}
          placeholder="Select a theme"
        />

        {/* Language Selector */}
        <Combobox
          options={bundledLanguagesInfo.map((language) => ({
            value: language.id,
            label: language.name,
          }))}
          selectedValue={{ value: lang, label: "TypeScript" }}
          onValueChange={(value) => setLang(value as BundledLanguage)}
          placeholder="Select a language"
        />

        {/* Capture Snapshot */}
        <Button
          onClick={captureCodeSnapshot}
          className="bg-[#32363F] text-[#ACACAE] hover:bg-[#414852]"
        >
          Capture Code Snapshot
        </Button>
      </div>

      {/* Editor & Preview */}
      <div
        ref={codeEditorContainerRef}
        className="relative min-h-full w-full rounded-xl shadow-lg"
      >
        {/* Highlighted Code (Hidden Behind Textarea) */}
        <div
          ref={codeRef}
          className="shiki absolute left-0 top-0 z-0 h-full min-h-[25rem] w-full whitespace-pre-wrap rounded-xl p-4 font-mono text-sm leading-7"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          aria-hidden="true"
        />

        {/* Transparent Input Layer */}
        <textarea
          ref={editorRef}
          onChange={(e) => setInput(e.target.value)}
          onScroll={handleScroll}
          className="relative inset-0 z-10 h-full min-h-[25rem] w-full resize-none overflow-auto rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-transparent caret-gray-500 outline-none"
          style={{
            caretColor: "#6b7280",
          }}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}
