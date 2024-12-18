"use client";

import type { JSX } from "react";
import { useState, useRef, useLayoutEffect } from "react";
import {
  bundledThemesInfo,
  bundledLanguagesInfo,
  BundledTheme,
  BundledLanguage,
} from "shiki";
import html2canvas from "html2canvas";
import { toast } from "sonner";

import { highlight } from "@/lib/shiki-highlighter";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

export function ShikiShotEditor() {
  const [theme, setTheme] = useState<BundledTheme>("vitesse-dark");
  const [lang, setLang] = useState<BundledLanguage>("typescript");
  const [input, setInput] = useState("// Type your code here");
  const [highlightedCode, setHighlightedCode] = useState<JSX.Element>();
  const codeEditorContainerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (codeRef.current && codeEditorContainerRef.current) {
      const preEl = codeRef.current.children[0] as HTMLPreElement;

      if (preEl) {
        codeEditorContainerRef.current.style.backgroundColor =
          preEl.style.backgroundColor;
      }
    }

    highlight(input, lang, theme).then((output) => setHighlightedCode(output));
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

    codeRef.current.scrollLeft = editorRef.current.scrollLeft;
    codeRef.current.scrollTop = editorRef.current.scrollTop;
  };

  return (
    <div className="my-10 flex flex-col gap-1">
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
        <Button onClick={captureCodeSnapshot}>Capture Code Snapshot</Button>
      </div>

      {/* Editor & Preview */}
      <div
        ref={codeEditorContainerRef}
        className="relative h-full min-h-[25rem] w-full rounded-xl"
      >
        {/* Highlighted Code (Hidden Behind Textarea) */}
        <div
          ref={codeRef}
          className="shiki absolute inset-0 z-0 min-h-[25rem] w-full overflow-hidden whitespace-pre-wrap rounded-xl p-4 font-mono text-sm leading-7"
          aria-hidden="true"
        >
          {highlightedCode && highlightedCode}
        </div>

        {/* Transparent Input Layer */}
        <textarea
          ref={editorRef}
          onChange={(e) => setInput(e.target.value)}
          onScroll={handleScroll}
          className="absolute inset-0 z-10 h-full min-h-[25rem] w-full resize-none overflow-hidden rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-transparent caret-gray-500 outline-none"
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}
