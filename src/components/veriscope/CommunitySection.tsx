import { useCallback, useEffect, useRef, useState } from "react";
import { DiamondMark, Section } from "./Section";
import {
  addComment,
  fetchComments,
  fetchPostStats,
  fetchRealCommentCount,
  formatCompact,
  relativeTime,
  togglePostLike,
  type CommunityComment,
  type PostSlug,
  PAGE_SIZE,
} from "@/lib/community";

type Props = {
  slug: PostSlug;
  title: string;
  subtitle: string;
  postBody: string;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M12 20.2 4.7 13a4.6 4.6 0 0 1 6.5-6.5l.8.8.8-.8A4.6 4.6 0 1 1 19.3 13z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M20 15.2a2.6 2.6 0 0 1-2.6 2.6H8.2L4 21V6.2A2.6 2.6 0 0 1 6.6 3.6h10.8A2.6 2.6 0 0 1 20 6.2z" />
    </svg>
  );
}

export function CommunitySection({ slug, title, subtitle, postBody }: Props) {
  const likeKey = `veriscope:like:${slug}`;

  const [displayLikes, setDisplayLikes] = useState<number | null>(null);
  const [displayComments, setDisplayComments] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLiked(window.localStorage.getItem(likeKey) === "1");
  }, [likeKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [stats, realCount] = await Promise.all([
          fetchPostStats(slug),
          fetchRealCommentCount(slug),
        ]);
        if (cancelled || !stats) return;
        setDisplayLikes(Number(stats.demo_likes) + Number(stats.real_likes));
        setDisplayComments(Number(stats.demo_comments) + realCount);
      } catch {
        /* counters stay hidden if the backend is unreachable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loadPage = useCallback(
    async (nextPage: number) => {
      setLoadingMore(true);
      try {
        const batch = await fetchComments(slug, nextPage);
        setComments((prev) => {
          const seen = new Set(prev.map((c) => c.id));
          return [...prev, ...batch.filter((c) => !seen.has(c.id))];
        });
        setHasMore(batch.length === PAGE_SIZE);
        setPage(nextPage);
      } catch {
        setHasMore(false);
      } finally {
        setLoadingMore(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    if (open && comments.length === 0) void loadPage(0);
  }, [open, comments.length, loadPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !open || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !loadingMore) {
          void loadPage(page + 1);
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open, hasMore, loadingMore, page, loadPage]);

  async function onToggleLike() {
    const next = !liked;
    setLiked(next);
    setDisplayLikes((v) => (v === null ? v : v + (next ? 1 : -1)));
    window.localStorage.setItem(likeKey, next ? "1" : "0");
    try {
      await togglePostLike(slug, next ? 1 : -1);
    } catch {
      setLiked(!next);
      setDisplayLikes((v) => (v === null ? v : v + (next ? -1 : 1)));
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) {
      setFormError("Add a name and a comment.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const created = await addComment(slug, trimmedName, trimmedText);
      setComments((prev) => [created, ...prev]);
      setDisplayComments((v) => (v === null ? v : v + 1));
      setText("");
    } catch {
      setFormError("That comment couldn't be posted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className="py-12 sm:py-16">
      <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>

      <article className="panel mt-7 p-5 sm:p-6">
        <header className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
            <DiamondMark className="h-4 w-4 text-gold" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Veriscope</span>
            <span className="text-xs tracking-wide text-muted-foreground">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success align-middle" />
              Live
            </span>
          </div>
        </header>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{postBody}</p>

        <div className="mt-5 flex items-center gap-6 border-t border-border pt-4">
          <button
            type="button"
            onClick={onToggleLike}
            aria-pressed={liked}
            className={`inline-flex items-center gap-2 text-sm transition-colors duration-300 ${
              liked ? "text-gold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HeartIcon filled={liked} />
            <span className="tabular-nums">
              {displayLikes === null ? "—" : formatCompact(displayLikes)}
            </span>
            <span className="sr-only">likes</span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <CommentIcon />
            <span className="tabular-nums">
              {displayComments === null ? "—" : formatCompact(displayComments)}
            </span>
            <span className="sr-only">comments</span>
          </button>
        </div>

        {open && (
          <div className="mt-5 border-t border-border pt-5">
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="Your name"
                aria-label="Your name"
                className="rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-gold/50 focus-visible:outline-none"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1200}
                rows={3}
                placeholder="Write a comment"
                aria-label="Write a comment"
                className="resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-gold/50 focus-visible:outline-none"
              />
              {formError && <p className="text-xs text-destructive">{formError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="self-start rounded-md border border-gold/60 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold transition-colors duration-300 hover:bg-gold/20 disabled:opacity-50"
              >
                {submitting ? "Posting…" : "Post comment"}
              </button>
            </form>

            <ul className="mt-7 flex flex-col divide-y divide-border">
              {comments.map((comment) => (
                <li key={comment.id} className="py-4 first:pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {comment.author_name}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      {relativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>

            <div ref={sentinelRef} className="h-8" />
            {loadingMore && (
              <p className="pb-2 text-center text-xs text-muted-foreground">Loading…</p>
            )}
            {!hasMore && comments.length === 0 && !loadingMore && (
              <p className="pb-2 text-center text-xs text-muted-foreground">
                No comments yet. Be the first.
              </p>
            )}
          </div>
        )}
      </article>
    </Section>
  );
}
