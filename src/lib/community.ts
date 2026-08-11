import { supabase } from "@/integrations/supabase/client";

export type PostSlug = "prime_feedback" | "session_matrix_feedback";

export type CommunityComment = {
  id: string;
  post_slug: string;
  author_name: string;
  content: string;
  likes: number;
  is_demo: boolean;
  created_at: string;
};

export type PostStats = {
  slug: string;
  demo_likes: number;
  demo_comments: number;
  real_likes: number;
};

export const PAGE_SIZE = 25;

/** 1000 -> 1k, 215000 -> 215k, 999999 -> 1M, 2500000 -> 2.5M */
export function formatCompact(value: number): string {
  if (!Number.isFinite(value) || value < 1000) return String(Math.max(0, Math.round(value)));

  if (value >= 999_500) {
    const millions = value / 1_000_000;
    const rounded = millions < 10 ? Math.round(millions * 10) / 10 : Math.round(millions);
    return `${trim(rounded)}M`;
  }

  const thousands = value / 1000;
  const rounded = thousands < 10 ? Math.floor(thousands * 10) / 10 : Math.floor(thousands);
  return `${trim(rounded)}k`;
}

function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export async function fetchPostStats(slug: PostSlug): Promise<PostStats | null> {
  const { data, error } = await supabase
    .from("community_posts")
    .select("slug, demo_likes, demo_comments, real_likes")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as PostStats | null;
}

export async function fetchRealCommentCount(slug: PostSlug): Promise<number> {
  const { count, error } = await supabase
    .from("community_comments")
    .select("id", { count: "exact", head: true })
    .eq("post_slug", slug)
    .eq("is_demo", false);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchComments(slug: PostSlug, page: number): Promise<CommunityComment[]> {
  const from = page * PAGE_SIZE;
  const { data, error } = await supabase
    .from("community_comments")
    .select("id, post_slug, author_name, content, likes, is_demo, created_at")
    .eq("post_slug", slug)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw error;
  return (data ?? []) as CommunityComment[];
}

export async function addComment(
  slug: PostSlug,
  authorName: string,
  content: string,
): Promise<CommunityComment> {
  const { data, error } = await supabase
    .from("community_comments")
    .insert({
      post_slug: slug,
      author_name: authorName.trim().slice(0, 40),
      content: content.trim().slice(0, 1200),
      is_demo: false,
      status: "approved",
      source: "web",
      likes: 0,
    })
    .select("id, post_slug, author_name, content, likes, is_demo, created_at")
    .single();

  if (error) throw error;
  return data as CommunityComment;
}

export async function togglePostLike(slug: PostSlug, delta: 1 | -1): Promise<number> {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    _slug: slug,
    _delta: delta,
  });

  if (error) throw error;
  return Number(data ?? 0);
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.round(days / 7);
  return `${weeks}w`;
}
