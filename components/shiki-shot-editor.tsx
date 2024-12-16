"use client";
import { useState, useEffect } from "react";
import {
  bundledThemesInfo,
  bundledLanguagesInfo,
  BundledTheme,
  BundledLanguage,
} from "shiki";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { highlighter } from "@/lib/shiki-highlighter";
import { Combobox } from "./ui/combobox";

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
