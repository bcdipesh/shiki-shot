import type { BundledLanguage, BundledLanguageInfo } from "shiki/types.mjs";

import { Combobox } from "@/components/ui/combobox";

interface LanguageSelectorProps {
  langs: BundledLanguageInfo[];
  selectedLang: BundledLanguage;
  onLangChange: (value: string) => void;
}

export function LanguageSelector({
  langs,
  selectedLang,
  onLangChange,
}: LanguageSelectorProps) {
  return (
    <Combobox
      options={langs.map((lang) => ({
        value: lang.id,
        label: lang.name,
      }))}
      selectedValue={{
        value: selectedLang,
        label: langs.find(({ id }) => id === selectedLang)?.name as string,
      }}
      onValueChange={onLangChange}
      placeholder="Select a language"
    />
  );
}
