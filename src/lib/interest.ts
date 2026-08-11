import { supabase } from "@/integrations/supabase/client";

export const PRIME_INTEREST_KEY = "prime_launch";

export async function fetchInterestCount(key = PRIME_INTEREST_KEY): Promise<number> {
  const { data, error } = await supabase
    .from("interest_counters")
    .select("count")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return Number(data?.count ?? 0);
}

export async function registerInterest(key = PRIME_INTEREST_KEY): Promise<number> {
  const { data, error } = await supabase.rpc("register_interest", { _key: key });
  if (error) throw error;
  return Number(data ?? 0);
}

export async function toggleInterest(delta: 1 | -1, key = PRIME_INTEREST_KEY): Promise<number> {
  const { data, error } = await supabase.rpc("toggle_interest", { _key: key, _delta: delta });
  if (error) throw error;
  return Number(data ?? 0);
}
