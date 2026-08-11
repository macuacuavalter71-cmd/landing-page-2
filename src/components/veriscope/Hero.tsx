import { Section } from "./Section";

export function Hero() {
  return (
    <Section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
      <p className="eyebrow">As promised.</p>
      <h1 className="mt-5 font-display text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-5xl">
        Knowing when to look was only half the problem.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        The other half is knowing what you're looking at when you get there.
      </p>
      <div className="hairline mt-12" />
    </Section>
  );
}

export function ContextBridge() {
  return (
    <Section className="py-12 sm:py-16">
      <p className="text-base leading-[1.8] text-muted-foreground sm:text-lg">
        Most traders spend years refining entries — better patterns, better confirmations, better
        signals. What's usually missing isn't a better signal. It's context: the moment a level
        actually means something. That's what the Session Matrix was built to show you. But once you
        know when to look, a second question shows up almost immediately:{" "}
        <span className="text-foreground">what exactly are you looking at?</span>
      </p>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/60 px-5 py-10 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
        <span className="font-display text-xs tracking-[0.3em] text-muted-foreground">
          VERISCOPE
        </span>
        <p className="text-sm text-muted-foreground">
          Veriscope — tools for traders who already read charts.
        </p>
      </div>
    </footer>
  );
}
