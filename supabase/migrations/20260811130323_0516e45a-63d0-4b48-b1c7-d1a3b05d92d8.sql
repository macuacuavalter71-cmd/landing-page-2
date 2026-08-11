create table public.community_posts (
  slug text primary key,
  title text not null,
  demo_likes bigint not null default 0,
  demo_comments bigint not null default 0,
  real_likes bigint not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.community_posts to anon, authenticated;
grant all on public.community_posts to service_role;
alter table public.community_posts enable row level security;
create policy "Anyone can read community posts" on public.community_posts for select to anon, authenticated using (true);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null references public.community_posts(slug) on delete cascade,
  author_name text not null,
  content text not null,
  likes integer not null default 0,
  is_demo boolean not null default false,
  status text not null default 'approved',
  source text not null default 'web',
  created_at timestamptz not null default now()
);

create index community_comments_post_created_idx on public.community_comments (post_slug, created_at desc);

grant select, insert on public.community_comments to anon, authenticated;
grant all on public.community_comments to service_role;
alter table public.community_comments enable row level security;

create policy "Anyone can read approved comments" on public.community_comments
  for select to anon, authenticated using (status = 'approved');

create policy "Anyone can post a real comment" on public.community_comments
  for insert to anon, authenticated
  with check (
    is_demo = false
    and status = 'approved'
    and source = 'web'
    and likes = 0
    and length(btrim(author_name)) between 1 and 40
    and length(btrim(content)) between 1 and 1200
  );

create or replace function public.toggle_post_like(_slug text, _delta integer)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  _new bigint;
begin
  if _delta not in (-1, 1) then
    raise exception 'invalid delta';
  end if;

  update public.community_posts
     set real_likes = greatest(0, real_likes + _delta)
   where slug = _slug
  returning real_likes into _new;

  if _new is null then
    raise exception 'unknown post';
  end if;

  return _new;
end;
$$;

grant execute on function public.toggle_post_like(text, integer) to anon, authenticated;

insert into public.community_posts (slug, title, demo_likes, demo_comments) values
  ('prime_feedback', 'Veriscope Prime — first impressions', 497000, 215000),
  ('session_matrix_feedback', 'Veriscope Session Matrix — delivery feedback', 753000, 249000);