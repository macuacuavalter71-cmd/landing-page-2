import { useEffect, useState } from "react";
import { Section } from "./Section";
import { fetchInterestCount, registerInterest } from "@/lib/interest";

const STORAGE_KEY = "veriscope:interest:prime_launch";
const BASELINE = 973000;

function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${Math.floor(value / 1000)}k`;
  return value.toLocaleString("en-US");
}

export function PrimeLaunch() {
  const [count, setCount] = useState<number | null>(null);
  const [registered, setRegistered] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setRegistered(window.localStorage.getItem(STORAGE_KEY) === "1");
    let cancelled = false;
    (async () => {
      try {
        const value = await fetchInterestCount();
        if (!cancelled) setCount(value);
      } catch {
        /* counter stays hidden if the backend is unreachable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onInterested() {
    if (pending) return;
    setPending(true);
    const next = !registered;
    try {
      const value = await toggleInterest(next ? 1 : -1);
      if (next) window.localStorage.setItem(STORAGE_KEY, "1");
      else window.localStorage.removeItem(STORAGE_KEY);
      setRegistered(next);
      setCount(value);
    } catch {
      /* leave the button actionable if the write failed */
    } finally {
      setPending(false);
    }
  }

  return (
    <Section className="py-14 sm:py-20">
      <div className="hairline" />
      <h2 className="mt-10 font-display text-2xl leading-[1.2] font-medium tracking-tight text-balance sm:text-4xl">
        Veriscope Prime launches August 21, 2026.
      </h2>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        This is your first look at Prime. Full access opens August 21. No price. No signup required
        today.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onInterested}
          aria-pressed={registered}
          className={`cursor-pointer rounded-md border px-6 py-3 text-sm font-medium tracking-[0.08em] uppercase transition-colors duration-300 active:scale-[0.98] ${
            registered
              ? "border-gold/60 bg-gold/20 text-gold hover:bg-gold/30"
              : "border-gold/60 bg-gold/10 text-gold hover:bg-gold/20"
          } disabled:opacity-70`}
          disabled={pending}
        >
          {pending ? "Registering…" : registered ? "Interest registered ✓" : "I'm interested"}
        </button>
        <span className="text-sm text-muted-foreground tabular-nums">
          {count === null ? "—" : `${formatCount(BASELINE + count)} traders interested`}
        </span>
      </div>
    </Section>
  );
}
