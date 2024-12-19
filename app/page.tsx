import { ShikiShotEditor } from "@/components/shiki-shot-editor";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="home-page-container pt-40">
      <div className="flex flex-col gap-8 text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="text-[#8cccd5]">Shiki 式</span>{" "}
          <span className="text-[#f4a6a6]">Shot 撮</span>
        </h1>
        <p className="text-xl">Turn your code into art.</p>
      </div>

      <div id="editor-container">
        <Suspense fallback={<div>Loading...</div>}>
          <ShikiShotEditor />
        </Suspense>
      </div>
    </div>
  );
}
