"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { type JSX } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

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

  const copyCodeImageToClipboard = async () => {
    if (!codeEditorContainerRef.current) return;

    const codeCanvas = await html2canvas(codeEditorContainerRef.current, {
      backgroundColor: "transparent",
    });
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

  const handleScroll = () => {
    if (!codeRef.current || !editorRef.current) {
      return;
    }

    codeRef.current.scrollLeft = editorRef.current.scrollLeft;
    codeRef.current.scrollTop = editorRef.current.scrollTop;
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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    const params = new URLSearchParams(searchParams);

    setInput(value);

    if (value) {
      params.set("code", value);
    } else {
      params.delete("code");
    }
  };

  return (
    <div className="my-10 flex flex-col gap-5">
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Theme Selector */}
        <Combobox
          options={bundledThemesInfo.map((theme) => ({
            value: theme.id,
            label: theme.displayName,
          }))}
          selectedValue={{
            value: theme,
            label: bundledThemesInfo.find(({ id }) => id === selectedTheme)
              ?.displayName as string,
          }}
          onValueChange={handleThemeChange}
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

        {/* Clipboard Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Copy to Clipboard</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Available Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={copyCodeImageToClipboard}>
                Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={getShareableUrl}>
                Shareable URL
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
          defaultValue={input}
          onChange={handleInputChange}
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
