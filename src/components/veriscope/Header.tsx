import { DiamondMark } from "./Section";

export function Header() {
  return (
    <header className="w-full border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2.5 px-5 py-6 sm:py-7">
        <DiamondMark className="h-4 w-4 text-gold" />
        <span className="font-display text-sm font-medium tracking-[0.34em] text-foreground">
          VERISCOPE
        </span>
      </div>
    </header>
  );
}
