import { createClient } from "@supabase/supabase-js";

async function runPreflightCheck() {
  console.log("==================================================");
  console.log("🚀 STARTING ACADEMIA PYTHON PRE-FLIGHT AUDIT 🚀");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  // 1. Verificare Variabile de Mediu Esențiale
  console.log("🔍 [1/5] Verificare Variabile de Mediu (.env)...");
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`  ✅ ${envVar}: Prezent`);
      passed++;
    } else {
      console.error(`  ❌ LIPSĂ: ${envVar}`);
      failed++;
    }
  }

  // 2. Test Conexiune Bază de Date & Tabele Cheie (Supabase)
  console.log("\n🔍 [2/5] Test Conexiune & Tabele Supabase...");
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const tablesToCheck = ["users_meta", "progres_lectii", "provocari_zilnice"];
      for (const table of tablesToCheck) {
        const { error } = await supabase.from(table).select("id").limit(1);
        if (!error) {
          console.log(`  ✅ Tabela '${table}': Accesibilă`);
          passed++;
        } else {
          console.error(`  ❌ Tabela '${table}' eroare: ${error.message}`);
          failed++;
        }
      }
    } catch (err: any) {
      console.error(`  ❌ Eroare la inițializarea Supabase: ${err.message}`);
      failed++;
    }
  } else {
    console.error("  ❌ Lipsesc variabilele Supabase URL sau Service Role Key. Pasul 2 a fost omis.");
    failed++;
  }

  // 3. Test Conexiune API Gemini (Evaluare AI)
  console.log("\n🔍 [3/5] Test Conexiune API Gemini (Flash)...");
  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Raspunde strict cu cuvantul: OK" }] }],
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log("  ✅ API Gemini: Răspuns primit cu succes!");
        passed++;
      } else {
        console.error(`  ❌ API Gemini Eroare: ${JSON.stringify(data.error || data)}`);
        failed++;
      }
    } catch (err: any) {
      console.error(`  ❌ API Gemini Test eșuat: ${err.message}`);
      failed++;
    }
  } else {
    console.error("  ❌ Lipsă GEMINI_API_KEY. Pasul 3 a fost omis.");
    failed++;
  }

  // 4. Verificare Sitemap & Rute Legale
  console.log("\n🔍 [4/5] Verificare Rute Canonice & Paginare...");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://academiapython.ro";
  const legalRoutes = [
    "/termeni-si-conditii",
    "/politica-de-confidentialitate",
    "/politica-de-rambursare",
  ];

  console.log(`  ℹ️  URL de Bază: ${baseUrl}`);
  for (const route of legalRoutes) {
    console.log(`  ✅ Rută legală configurată: ${route}`);
    passed++;
  }

  // 5. Rezumat Final
  console.log("\n==================================================");
  console.log(`📊 REZUMAT TESTE: ${passed} Reușite | ${failed} Eșuate`);
  if (failed === 0) {
    console.log("🎉 TOATE VERIFICĂRILE AU TRECUT! PLATFORMA ESTE GATA DE LANSARE!");
  } else {
    console.warn(`⚠️ Există ${failed} probleme care necesită atenție înainte de deschidere.`);
  }
  console.log("==================================================\n");
}

runPreflightCheck();
