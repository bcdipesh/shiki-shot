interface CodeplaygroundProps {
  highlightedCodeRef: React.Ref<HTMLSpanElement>;
  highlightedCode: React.JSX.Element;
  defaultValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Codeplayground({
  highlightedCodeRef,
  highlightedCode,
  defaultValue,
  onInputChange,
}: CodeplaygroundProps) {
  return (
    <div className="relative h-full min-h-96 w-full rounded-xl bg-[--shiki-background]">
      {/* Highlighted Code (Hidden Behind Textarea) */}
      <span
        ref={highlightedCodeRef}
        className="absolute inset-0 z-0 h-full min-h-96 w-full overflow-hidden whitespace-pre-wrap rounded-xl bg-transparent font-mono text-sm leading-7"
        aria-hidden="true"
      >
        {highlightedCode}
      </span>

      {/* Transparent Input Layer */}
      <textarea
        defaultValue={defaultValue}
        onChange={onInputChange}
        className="absolute inset-0 z-10 h-full w-full resize-none overflow-hidden rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-transparent caret-gray-500 outline-none"
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}
