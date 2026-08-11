import { Section } from "./Section";

/**
 * Real screenshots only. Until real Prime screenshots are uploaded, these slots
 * stay in an honest empty state — never a simulated or fabricated chart.
 */
const SLOTS: { id: string; label: string; src?: string; alt: string }[] = [
  {
    id: "structure",
    label: "Structure & multi-timeframe context",
    alt: "Veriscope Prime running on a live chart — structure and multi-timeframe context",
  },
  {
    id: "zones",
    label: "Order blocks & fair value gaps",
    alt: "Veriscope Prime running on a live chart — order blocks and fair value gaps",
  },
  {
    id: "liquidity",
    label: "Liquidity & dashboard",
    alt: "Veriscope Prime running on a live chart — liquidity levels and dashboard",
  },
];

function Slot({ slot }: { slot: (typeof SLOTS)[number] }) {
  return (
    <figure className="w-[82vw] max-w-xl shrink-0 snap-center sm:w-full sm:max-w-none">
      <div className="panel overflow-hidden">
        {slot.src ? (
          <img
            src={slot.src}
            alt={slot.alt}
            loading="lazy"
            className="h-auto w-full object-contain"
          />
        ) : (
          <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 bg-surface-raised/40 px-6 text-center">
            <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Screenshot pending upload
            </span>
            <span className="max-w-xs text-xs leading-relaxed text-muted-foreground/70">
              Only real screenshots of Prime on a live chart will appear here.
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-2.5 text-xs tracking-wide text-muted-foreground">
        {slot.label}
      </figcaption>
    </figure>
  );
}

export function PrimeSection() {
  return (
    <Section className="py-12 sm:py-16">
      <p className="eyebrow">Beyond timing</p>
      <h2 className="mt-4 font-display text-2xl font-medium tracking-tight sm:text-4xl">
        Veriscope Prime
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        If the Session Matrix tells you when to pay attention, Prime is what you see once you do.
      </p>

      <div className="mt-8 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-1 sm:gap-6 sm:overflow-visible sm:px-0">
        {SLOTS.map((slot) => (
          <Slot key={slot.id} slot={slot} />
        ))}
      </div>

      <div className="mt-10 space-y-5 text-base leading-[1.8] text-muted-foreground sm:text-lg">
        <p>
          Structure tracked across three layers — from the overall trend down to the smallest shift,
          so you always know which move actually matters.
        </p>
        <p>
          Order blocks and fair value gaps followed through their full lifecycle — active,
          reclaimed, or broken — not just marked once and forgotten.
        </p>
        <p>
          Liquidity mapped where it's actually building: equal highs, equal lows, and the levels the
          market has already reached to sweep.
        </p>
        <p>
          All synced to a higher timeframe, so the small picture never quietly contradicts the big
          one.
        </p>
      </div>

      <p className="mt-10 text-base text-foreground sm:text-lg">
        This isn't something we're asking you to buy right now. It's something we wanted you to see.
      </p>
    </Section>
  );
}
