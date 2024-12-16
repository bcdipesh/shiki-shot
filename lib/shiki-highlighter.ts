import { bundledLanguages, bundledThemes, createHighlighter } from "shiki";

export const highlighter = createHighlighter({
  themes: Object.keys(bundledThemes),
  langs: Object.keys(bundledLanguages),
});
