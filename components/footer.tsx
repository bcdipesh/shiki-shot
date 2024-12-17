import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  const currentYear = new Date();

  return (
    <footer className="flex items-center justify-between">
      <div>
        <p className="text-balance text-sm text-muted-foreground">
          &copy; {currentYear.getFullYear()} |{" "}
          <span className="inline-block">
            <span className="text-[#8cccd5]">Shiki 式</span>{" "}
            <span className="text-[#f4a6a6]">Shot 撮</span>
          </span>
        </p>
      </div>

      <div>
        <ThemeToggle />
      </div>
    </footer>
  );
}
