import type { JSX } from "react";
import { type BundledLanguage, type BundledTheme, codeToHast } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

export async function highlight(
  code: string,
  lang: BundledLanguage,
  theme: BundledTheme,
) {
  const out = await codeToHast(code, {
    lang,
    theme,
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element;
}
