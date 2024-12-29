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

  const initialTheme =
    (searchParams.get("theme") as BundledTheme) || "vitesse-dark";
  const initialLang =
    (searchParams.get("lang") as BundledLanguage) || "typescript";
  const initialCode = searchParams.get("code") || "// Type your code here";

  const [theme, setTheme] = useState<BundledTheme>(initialTheme);
  const [lang, setLang] = useState<BundledLanguage>(initialLang);
  const [input, setInput] = useState(initialCode);
  const [highlightedCode, setHighlightedCode] = useState<JSX.Element>();
  const codeRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Initial highlight on mount
  useEffect(() => {
    highlight(initialCode, initialLang, initialTheme).then((output) => {
      setHighlightedCode(output);
    });
  }, [initialCode, initialLang, initialTheme]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    const code = codeRef.current;

    const handleScroll = () => {
      if (textArea && code) {
        code.scrollTop = textArea.scrollTop;
        code.scrollLeft = textArea.scrollLeft;
      }
    };

    if (textArea) {
      textArea.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (textArea) {
        textArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const copyCodeImageToClipboard = async () => {
    if (!codeRef.current) return;

    const codeCanvas = await html2canvas(
      codeRef.current.querySelector("pre") as HTMLPreElement,
      {
        backgroundColor: "transparent",
        scale: 2,
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
    if (input) {
      params.set("code", input);
    }

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

  const handleThemeChange = async (selectedTheme: string) => {
    const theme = selectedTheme as BundledTheme;
    const output = await highlight(input, lang, theme);

    setTheme(theme);
    setHighlightedCode(output);
  };

  const handleLangChange = async (selectedLang: string) => {
    const lang = selectedLang as BundledLanguage;
    const output = await highlight(input, lang, theme);

    setLang(lang);
    setHighlightedCode(output);
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const output = await highlight(value, lang, theme);

    setInput(value);
    setHighlightedCode(output);
  };

  return (
    <div className="my-10 flex min-h-96 flex-col gap-5 bg-[--shiki-background]">
      <div className="flex flex-col gap-4 md:flex-row">
        <ThemeSelector
          themes={bundledThemesInfo}
          selectedTheme={theme}
          onThemeChange={handleThemeChange}
        />

        <LanguageSelector
          langs={bundledLanguagesInfo}
          selectedLang={lang}
          onLangChange={handleLangChange}
        />

        <UserAction
          onCopyImage={copyCodeImageToClipboard}
          onGenerateUrl={getShareableUrl}
        />
      </div>

      <Codeplayground
        highlightedCodeRef={codeRef}
        highlightedCode={highlightedCode as JSX.Element}
        textAreaRef={textAreaRef}
        defaultValue={input}
        onInputChange={handleInputChange}
      />
    </div>
  );
}
