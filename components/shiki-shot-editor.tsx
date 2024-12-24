"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useState, useRef, useEffect, type JSX } from "react";
import {
  bundledThemesInfo,
  bundledLanguagesInfo,
  BundledTheme,
  BundledLanguage,
} from "shiki";
import html2canvas from "html2canvas";
import { toast } from "sonner";

import { highlight } from "@/lib/shiki-highlighter";
import { UserAction } from "@/components/user-actions";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeSelector } from "@/components/theme-selector";
import { Codeplayground } from "@/components/code-playground";

export function ShikiShotEditor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedTheme =
    (searchParams.get("theme") as BundledTheme) || "vitesse-dark";
  const selectedLang =
    (searchParams.get("lang") as BundledLanguage) || "typescript";
  const code = searchParams.get("code") || "// Type your code here";

  const [theme, setTheme] = useState<BundledTheme>(selectedTheme);
  const [lang, setLang] = useState<BundledLanguage>(selectedLang);
  const [input, setInput] = useState(code);
  const [highlightedCode, setHighlightedCode] = useState<JSX.Element>();
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    highlight(input, lang, theme).then((output) => {
      setHighlightedCode(output);
    });
  }, []);

  const copyCodeImageToClipboard = async () => {
    if (!codeRef.current) return;

    const codeCanvas = await html2canvas(
      codeRef.current.querySelector("pre") as HTMLPreElement,
      {
        backgroundColor: "transparent",
      },
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
        toast(
          "📸 Snippet snapped! Your image is polished and ready in the clipboard. 🚀",
        );
      } catch (error) {
        toast(
          `❌ Yikes! Couldn't copy the image. Debugging time: ${(error as Error).message}`,
        );
        console.error("Failed to copy image to the clipboard:", error);
      }
    };
  };

  const getShareableUrl = async () => {
    const params = new URLSearchParams(searchParams);
    params.set("code", input);
    params.set("theme", theme);
    params.set("lang", lang);

    const shareableUrl = `${window.location.origin}${pathname}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast(
        "🔗 Link generated! Share the beauty of your code with the world. 🌐",
      );
    } catch (error) {
      toast(
        `💥 Uh-oh! The link didn't make it. Error: ${(error as Error).message}`,
      );
      console.error("Failed to copy URL to clipboard:", error);
    }
  };

  const handleThemeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    setTheme(value as BundledTheme);

    if (value) {
      params.set("theme", value);
    } else {
      params.delete("theme");
    }
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const params = new URLSearchParams(searchParams);

    setInput(value);

    const output = await highlight(value, lang, theme);
    setHighlightedCode(output);

    if (value) {
      params.set("code", value);
    } else {
      params.delete("code");
    }
  };

  return (
    <div className="my-10 flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row">
        <ThemeSelector
          themes={bundledThemesInfo}
          selectedTheme={theme}
          onThemeChange={handleThemeChange}
        />

        <LanguageSelector
          langs={bundledLanguagesInfo}
          selectedLang={lang}
          onLangChange={(value) => setLang(value as BundledLanguage)}
        />

        <UserAction
          onCopyImage={copyCodeImageToClipboard}
          onGenerateUrl={getShareableUrl}
        />
      </div>

      <Codeplayground
        highlightedCodeRef={codeRef}
        highlightedCode={highlightedCode as JSX.Element}
        defaultValue={input}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
