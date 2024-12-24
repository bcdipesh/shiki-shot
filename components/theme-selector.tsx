import type { BundledTheme, BundledThemeInfo } from "shiki/types.mjs";

import { Combobox } from "@/components/ui/combobox";

interface ThemeSelectorProps {
  themes: BundledThemeInfo[];
  selectedTheme: BundledTheme;
  onThemeChange: (value: string) => void;
}

export function ThemeSelector({
  themes,
  selectedTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <Combobox
      options={themes.map((theme) => ({
        value: theme.id,
        label: theme.displayName,
      }))}
      selectedValue={{
        value: selectedTheme,
        label: themes.find(({ id }) => id === selectedTheme)
          ?.displayName as string,
      }}
      onValueChange={onThemeChange}
      placeholder="Select a theme"
    />
  );
}
