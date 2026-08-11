CREATE TABLE public.interest_counters (
  key text PRIMARY KEY,
  count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.interest_counters TO anon, authenticated;
GRANT ALL ON public.interest_counters TO service_role;

ALTER TABLE public.interest_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read interest counters"
ON public.interest_counters FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.interest_counters (key, count) VALUES ('prime_launch', 0);

CREATE OR REPLACE FUNCTION public.register_interest(_key text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  _new bigint;
begin
  update public.interest_counters
     set count = count + 1
   where key = _key
  returning count into _new;

  if _new is null then
    raise exception 'unknown counter';
  end if;

  return _new;
end;
$$;

GRANT EXECUTE ON FUNCTION public.register_interest(text) TO anon, authenticated;