import { creeazaClientServer } from "@/lib/supabase/server";

/**
 * Exercițiile rezolvate salvate în contul utilizatorului (tabelul
 * exercitii_rezolvate, supabase/migrare-exercitii-rezolvate.sql).
 * Întoarce o listă goală dacă Supabase nu e configurat, dacă migrarea nu a
 * fost rulată încă sau dacă interogarea eșuează — progresul din browser
 * continuă să funcționeze ca înainte.
 */
export async function getExercitiiRezolvateCont(userId: string): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  try {
    const supabase = await creeazaClientServer();
    const { data, error } = await supabase
      .from("exercitii_rezolvate")
      .select("exercitiu_id")
      .eq("user_id", userId)
      .limit(5000);
    if (error) return [];
    return (data ?? []).map((r) => r.exercitiu_id as string);
  } catch {
    return [];
  }
}
