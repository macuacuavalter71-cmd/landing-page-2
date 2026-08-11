import { useEffect, useState } from "react";
import { Section } from "./Section";

const FILE_NAME = "Veriscope_Session_Matrix.txt";
const FILE_URL = `/${FILE_NAME}`;

export function Delivery() {
  const [code, setCode] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(FILE_URL)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setCode(text);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    if (!code) return;
    setShowCode(true);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
      setCopied(true);
    }
  }

  return (
    <Section className="py-14 sm:py-20">
      <div className="hairline mb-12" />
      <h2 className="font-display text-2xl font-medium tracking-tight sm:text-4xl">
        Your access is ready.
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        The same tool from yesterday — Pine Script v6, yours to keep. No subscription, no card, no
        account.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!code}
          className="inline-flex flex-1 items-center justify-center rounded-md border border-gold/60 bg-gold/10 px-6 py-3.5 text-sm font-medium tracking-wide text-gold transition-colors duration-300 hover:bg-gold/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:opacity-50"
        >
          {copied ? "Copied" : "Copy Veriscope Session Matrix"}
        </button>
        <a
          href={FILE_URL}
          download={FILE_NAME}
          className="inline-flex flex-1 items-center justify-center rounded-md border border-border bg-surface px-6 py-3.5 text-sm font-medium tracking-wide text-foreground transition-colors duration-300 hover:border-gold/40 hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          Download Veriscope Session Matrix
        </a>
      </div>

      <p className="mt-4 text-sm text-gold">One more thing worth knowing. Watch your inbox tomorrow.</p>

      {loadError && (
        <p className="mt-4 text-sm text-destructive">
          The script file couldn't be loaded right now. Please refresh the page.
        </p>
      )}

      {showCode && code && (
        <div className="panel mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="font-mono text-xs text-muted-foreground">{FILE_NAME}</span>
            <button
              type="button"
              onClick={() => setShowCode(false)}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Hide
            </button>
          </div>
          <pre className="max-h-[26rem] overflow-auto bg-background/60 p-4 text-left">
            <code className="font-mono text-[11px] leading-relaxed whitespace-pre text-muted-foreground">
              {code}
            </code>
          </pre>
        </div>
      )}
    </Section>
  );
}
