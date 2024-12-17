import {
  bundledLanguages,
  bundledThemes,
  createHighlighter,
  Highlighter,
} from "shiki";

let highlighterInstance: Highlighter | null = null;

export const getSingletonHighlighter = async () => {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages),
    });
  }

  return highlighterInstance;
};
