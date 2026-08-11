import { useEffect, useState } from "react";
import { Section } from "./Section";
import { fetchInterestCount, registerInterest } from "@/lib/interest";

const STORAGE_KEY = "veriscope:interest:prime_launch";

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
    if (registered || pending) return;
    setPending(true);
    try {
      const value = await registerInterest();
      window.localStorage.setItem(STORAGE_KEY, "1");
      setRegistered(true);
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
          disabled={registered || pending}
          className={`rounded-md border px-6 py-3 text-sm font-medium tracking-[0.08em] uppercase transition-colors duration-300 ${
            registered
              ? "cursor-default border-gold/40 bg-gold/15 text-gold"
              : "border-gold/60 bg-gold/10 text-gold hover:bg-gold/20"
          } disabled:opacity-80`}
        >
          {registered ? "Interest registered" : pending ? "Registering…" : "I'm interested"}
        </button>
        <span className="text-sm text-muted-foreground tabular-nums">
          {count === null ? "—" : `${count.toLocaleString("en-US")} traders interested`}
        </span>
      </div>
    </Section>
  );
}
