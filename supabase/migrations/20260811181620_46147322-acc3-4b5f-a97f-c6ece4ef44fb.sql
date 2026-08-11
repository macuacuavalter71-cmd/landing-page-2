CREATE OR REPLACE FUNCTION public.toggle_interest(_key text, _delta integer)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count bigint;
BEGIN
  IF _delta NOT IN (-1, 1) THEN
    RAISE EXCEPTION 'invalid delta';
  END IF;

  INSERT INTO public.interest_counters (key, count)
  VALUES (_key, GREATEST(_delta, 0))
  ON CONFLICT (key) DO UPDATE
    SET count = GREATEST(public.interest_counters.count + _delta, 0)
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_interest(text, integer) TO anon, authenticated;