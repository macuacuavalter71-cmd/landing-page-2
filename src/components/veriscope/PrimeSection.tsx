import { useEffect, useRef, useState } from "react";
import { Section } from "./Section";
import { ZoomableShot, openLightbox } from "./Lightbox";
import shot3h from "@/assets/prime-12.jpg.asset.json";
import shot2h from "@/assets/prime-11.jpg.asset.json";
import shotDense from "@/assets/prime-10.jpg.asset.json";
import shotPlain from "@/assets/prime-07.jpg.asset.json";

const HERO_ALT = "Veriscope Prime on BTCUSD 3h — structure, zones and dashboard visible";

const REVEALS = [
  {
    id: "structure",
    title: "See the structure",
    body: "Understand how price is behaving before you start searching for an entry.",
    benefit: "Context before decision.",
    src: shot3h.url,
    alt: HERO_ALT,
  },
  {
    id: "zones",
    title: "See what remains relevant",
    body: "Keep important Order Blocks and Fair Value Gaps in context as the market develops.",
    benefit: "Less manual reconstruction. More continuity.",
    src: shot2h.url,
    alt: "Veriscope Prime on BTCUSD 2h — order blocks and fair value gaps tracked in context",
  },
  {
    id: "liquidity",
    title: "See where liquidity matters",
    body: "Visualize relevant highs, lows, liquidity areas and market sweeps within the same framework.",
    benefit: "Know where the market has left important information behind.",
    src: shotDense.url,
    alt: "Veriscope Prime on BTCUSD 2h — liquidity levels, equal highs and lows, and sweeps",
  },
  {
    id: "mtf",
    title: "See the bigger picture",
    body: "Relate the current movement to higher-timeframe context instead of reading every timeframe in isolation.",
    benefit: "See the current move without losing the larger context.",
    src: shot3h.url,
    alt: "Veriscope Prime dashboard — higher-timeframe context alongside the current move",
  },
];

/** Horizontal drag/swipe reveal. Vertical page scroll is never blocked. */
function RevealTrack() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const drag = useRef<{ startX: number; startLeft: number; active: boolean }>({
    startX: 0,
    startLeft: 0,
    active: false,
  });

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    setActive(Math.min(REVEALS.length - 1, Math.max(0, index)));
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "touch") return; // native touch scrolling handles this
    const el = trackRef.current;
    if (!el) return;
    drag.current = { startX: e.clientX, startLeft: el.scrollLeft, active: true };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  }

  function endDrag(e: React.PointerEvent) {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const index = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  function goTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-y" }}
      >
        {REVEALS.map((step, i) => (
          <div key={step.id} className="w-full shrink-0 snap-center pr-0">
            <div className="select-none">
              <ZoomableShot src={step.src} alt={step.alt} caption={step.title} />
            </div>
            <div className="mt-5">
              <span className="eyebrow">
                {String(i + 1).padStart(2, "0")} / {String(REVEALS.length).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-medium tracking-tight sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {step.body}
              </p>
              <p className="mt-3 text-sm text-gold sm:text-base">{step.benefit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {REVEALS.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${step.title}`}
              aria-current={active === i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                active === i ? "w-8 bg-gold" : "w-3 bg-border hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
        <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {isMobile ? "Swipe to explore" : "Drag to explore"}
        </span>
      </div>
    </div>
  );
}

const POSSIBLE = [
  {
    title: "Read the market before looking for an entry",
    body: "Understand the structure surrounding price before immediately searching for the next setup.",
    highlight: "Context before decision.",
  },
  {
    title: "Know which levels deserve your attention",
    body: "See relevant structural and liquidity information without having to rebuild the entire market map manually.",
    highlight: "Spend less time searching for what matters.",
  },
  {
    title: "Keep important zones in context",
    body: "Follow Order Blocks and Fair Value Gaps as the market develops instead of treating every mark as an isolated event.",
    highlight: "More continuity. Less reconstruction.",
  },
  {
    title: "See the current move inside the bigger picture",
    body: "Use higher-timeframe context to understand where the current movement sits within the broader market structure.",
    highlight: "See the smaller move without losing the larger picture.",
  },
];

export function PrimeSection() {
  return (
    <>
      <Section className="py-12 sm:py-16">
        <p className="eyebrow">Beyond timing</p>
        <h2 className="mt-4 font-display text-2xl font-medium tracking-tight sm:text-4xl">
          Veriscope Prime
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          If the Session Matrix tells you when to pay attention, Prime helps you understand what
          you're looking at when you get there.
        </p>

        <div className="mt-9">
          <button
            type="button"
            onClick={() =>
              openLightbox({
                src: shot3h.url,
                alt: HERO_ALT,
                caption: "Veriscope Prime — BTCUSD 3h",
              })
            }
            className="panel block w-full cursor-zoom-in overflow-hidden"
            aria-label="Open larger view — Veriscope Prime on BTCUSD 3h"
          >
            <img src={shot3h.url} alt={HERO_ALT} className="h-auto w-full object-contain" />
          </button>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-sm text-muted-foreground sm:text-base">
              See the market with more of its context visible.
            </p>
            <span className="text-xs tracking-[0.18em] text-gold uppercase">Explore Prime ↓</span>
          </div>
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <h3 className="font-display text-xl font-medium tracking-tight text-balance sm:text-3xl">
          There's more to the chart than what you see at first.
        </h3>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Drag to explore Veriscope Prime.
        </p>
        <div className="mt-8">
          <RevealTrack />
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <p className="eyebrow">Depth</p>
        <h3 className="mt-4 font-display text-xl font-medium tracking-tight sm:text-3xl">
          Markets don't always stay clean.
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          When the chart becomes more complex, context becomes more important — not less. Prime
          helps organize that context instead of asking you to hold it all in your head.
        </p>
        <div className="mt-8">
          <ZoomableShot
            src={shotDense.url}
            alt="Veriscope Prime on a dense BTCUSD chart — many structural marks, zones and liquidity levels at once"
            caption="Veriscope Prime — a denser market picture"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            A denser market picture, still organized around the same framework.
          </p>
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <div className="hairline" />
        <h3 className="mt-10 font-display text-xl leading-[1.25] font-medium tracking-tight text-balance sm:text-3xl">
          The price is already there. But context changes what you can see.
        </h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <figure>
            <ZoomableShot
              src={shotPlain.url}
              alt="BTCUSD 30m chart without the Veriscope Prime overlay"
              caption="Price only — BTCUSD 30m"
            />
            <figcaption className="mt-2.5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Price only
            </figcaption>
          </figure>
          <figure>
            <ZoomableShot
              src={shot2h.url}
              alt="Veriscope Prime on BTCUSD 2h — price with structural and liquidity context"
              caption="Price + context — Veriscope Prime"
            />
            <figcaption className="mt-2.5 text-xs tracking-[0.16em] text-gold uppercase">
              Price + context
            </figcaption>
          </figure>
        </div>
        <p className="mt-6 text-base leading-[1.8] text-muted-foreground sm:text-lg">
          The chart gives you the price. Prime gives you more of the context around it. These are
          different charts and different timeframes — the comparison is conceptual, not a
          before-and-after of the same moment. The price stays exactly what it is; what changes is
          how much context you can see and relate at once.
        </p>
      </Section>

      <Section className="py-12 sm:py-16">
        <h3 className="font-display text-xl font-medium tracking-tight text-balance sm:text-3xl">
          What becomes possible when the pieces are visible together?
        </h3>
        <div className="mt-8 flex flex-col divide-y divide-border border-t border-border">
          {POSSIBLE.map((item) => (
            <div key={item.title} className="py-6">
              <h4 className="font-display text-base font-medium tracking-tight sm:text-xl">
                {item.title}
              </h4>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.body}
              </p>
              <p className="mt-3 text-sm text-gold">{item.highlight}</p>
            </div>
          ))}
          <div className="py-6">
            <h4 className="font-display text-base font-medium tracking-tight sm:text-xl">
              Bring the pieces together
            </h4>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Structure, liquidity, zones and multi-timeframe context come together in one
              synchronized visual framework.
            </p>
          </div>
        </div>
        <p className="mt-8 font-display text-lg leading-[1.4] font-medium tracking-tight text-balance sm:text-2xl">
          The goal isn't more information. It's making better use of the information already on the
          chart.
        </p>
      </Section>

      <Section className="py-16 sm:py-24">
        <div className="hairline" />
        <h3 className="mt-12 font-display text-2xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl">
          More context.
          <br />
          Less reconstruction.
        </h3>
        <p className="mt-6 max-w-2xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
          You already know what to look for. The question is how much work it takes to reconstruct
          the market picture every time you open a chart. Prime was designed to bring the pieces
          together.
        </p>
        <div className="hairline mt-12" />
      </Section>

      <Section className="py-12 sm:py-16">
        <p className="text-base text-foreground sm:text-lg">
          Not another signal to add to your chart.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Prime is designed as a framework for reading the context already present in the market.
        </p>
      </Section>

      <Section className="py-12 sm:py-16">
        <p className="eyebrow">When / What</p>
        <h3 className="mt-4 font-display text-xl leading-[1.25] font-medium tracking-tight text-balance sm:text-3xl">
          You know when to look.
          <br />
          Now see what matters.
        </h3>

        <div className="mt-9 flex flex-col items-stretch gap-3">
          <div className="panel p-5 sm:p-6">
            <span className="text-xs tracking-[0.2em] text-gold uppercase">
              Veriscope Session Matrix — When
            </span>
            <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
              Know when the market deserves your attention.
            </p>
          </div>
          <span aria-hidden="true" className="text-center text-muted-foreground/60">
            ↓
          </span>
          <div className="panel p-5 sm:p-6">
            <span className="text-xs tracking-[0.2em] text-gold uppercase">
              Veriscope Prime — What
            </span>
            <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
              Understand what you're looking at when you get there.
            </p>
          </div>
          <span aria-hidden="true" className="text-center text-muted-foreground/60">
            ↓
          </span>
          <div className="panel border-gold/30 p-5 sm:p-6">
            <span className="text-xs tracking-[0.2em] text-gold uppercase">Together</span>
            <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
              A more complete way to approach the chart.
            </p>
          </div>
        </div>

        <p className="mt-8 text-base leading-[1.8] text-muted-foreground sm:text-lg">
          The Session Matrix helps answer when to pay attention. Prime helps answer what you're
          seeing when you do. Different problems. One continuous workflow.
        </p>
      </Section>

      <Section className="py-16 sm:py-24">
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>You don't need another reason to stare at the chart.</p>
          <p>
            Sometimes you need a better way to understand what you're already looking at.
          </p>
          <p className="text-foreground">Prime was built for that moment.</p>
        </div>
      </Section>
    </>
  );
}
