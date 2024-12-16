"use client";

import { useState, useEffect } from "react";
import {
  bundledThemesInfo,
  bundledLanguagesInfo,
  BundledTheme,
  BundledLanguage,
} from "shiki";
import html2canvas from "html2canvas";
import { toast } from "sonner";

import { highlighter } from "@/lib/shiki-highlighter";

import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

export function ShikiShotEditor() {
  const [theme, setTheme] = useState<BundledTheme>("vitesse-dark");
  const [lang, setLang] = useState<BundledLanguage>("typescript");
  const [input, setInput] = useState("// Type your code here");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const highlightCode = async () => {
      const highlightedCode = (await highlighter).codeToHtml(input, {
        lang,
        theme,
      });
      setOutput(highlightedCode);
    };

    highlightCode();
  }, [input, lang, theme]);

  const captureCodeSnapshot = async () => {
    const codeCanvas = await html2canvas(
      document.querySelector(".shiki") as HTMLElement,
    );
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

  return (
    <div className="my-10 flex flex-col gap-10">
      <div className="flex flex-col gap-10 md:flex-row">
        <Combobox
          options={bundledThemesInfo.map((theme) => ({
            value: theme.id,
            label: theme.displayName,
          }))}
          selectedValue={{ value: theme, label: "Vitesse Dark" }}
          onValueChange={(value) => setTheme(value as BundledTheme)}
          placeholder="Select a theme"
        />

        <Combobox
          options={bundledLanguagesInfo.map((language) => ({
            value: language.id,
            label: language.name,
          }))}
          selectedValue={{ value: lang, label: "TypeScript" }}
          onValueChange={(value) => setLang(value as BundledLanguage)}
          placeholder="Select a language"
        />

        <Button onClick={captureCodeSnapshot}>Capture Code Snapshot</Button>
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
      />

      <div dangerouslySetInnerHTML={{ __html: output }} />
    </div>
  );
}
