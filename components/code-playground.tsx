interface CodeplaygroundProps {
  highlightedCodeRef: React.Ref<HTMLSpanElement>;
  highlightedCode: React.JSX.Element;
  textAreaRef: React.Ref<HTMLTextAreaElement>;
  defaultValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Codeplayground({
  highlightedCodeRef,
  highlightedCode,
  textAreaRef,
  defaultValue,
  onInputChange,
}: CodeplaygroundProps) {
  return (
    <div className="relative h-full min-h-96 w-full rounded-xl bg-[--shiki-background]">
      {/* Highlighted Code (Hidden Behind Textarea) */}
      <span
        ref={highlightedCodeRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-auto whitespace-pre-wrap rounded-xl bg-transparent font-mono text-sm leading-7"
        aria-hidden="true"
      >
        {highlightedCode}
      </span>

      {/* Transparent Input Layer */}
      <textarea
        ref={textAreaRef}
        defaultValue={defaultValue}
        onChange={onInputChange}
        className="absolute inset-0 z-10 h-full w-full resize-none overflow-auto rounded-xl bg-transparent p-4 font-mono text-sm leading-7 text-transparent caret-gray-500 outline-none"
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}
