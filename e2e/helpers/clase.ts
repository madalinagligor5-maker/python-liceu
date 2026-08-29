import { createClient } from "@supabase/supabase-js";

function creeazaClientAdminTest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Lipsesc variabilele Supabase pentru testele E2E.");
  }
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Creează o clasă de test direct în DB (service role), ca fixture pentru teste. */
export async function creeazaClasaTest(profesorId: string, numeClasa: string) {
  const admin = creeazaClientAdminTest();
  const codClasa = `E2E${Math.floor(Math.random() * 900000 + 100000)}`;
  const { data, error } = await admin
    .from("clase")
    .insert({ profesor_id: profesorId, nume_clasa: numeClasa, cod_clasa: codClasa })
    .select("id, cod_clasa")
    .single();
  if (error || !data) throw new Error(`Nu s-a putut crea clasa de test: ${error?.message}`);
  return { id: data.id as string, codClasa: data.cod_clasa as string };
}

export async function stergeClasaTest(clasaId: string) {
  const admin = creeazaClientAdminTest();
  await admin.from("clase").delete().eq("id", clasaId);
}
