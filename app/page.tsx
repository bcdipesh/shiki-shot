import { ShikiShotEditor } from "@/components/shiki-shot-editor";

export default function Page() {
  return (
    <div className="home-page-container py-40">
      <div className="flex flex-col gap-8 text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="text-[#8cccd5]">Shiki 式</span>{" "}
          <span className="text-[#f4a6a6]">Shot 撮</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Turn your code into art.
        </p>
      </div>

      <div id="editor-container">
        <ShikiShotEditor />
      </div>
    </div>
  );
}
