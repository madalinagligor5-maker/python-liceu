"use server";

export type FeedbackAI = {
  scor: string;
  analiza: string;
  indrumare: string;
  indiciu_sintaxa: string;
};

import { getUtilizatorCurent } from "@/lib/subscription";
import { creeazaClientServer } from "@/lib/supabase/server";

export async function evalueazaCodCuAI(
  titluProblema: string,
  enuntProblema: string,
  codElev: string,
  outputRulare: string
): Promise<{ ok: boolean; feedback?: FeedbackAI; eroare?: string }> {
  // Verificare autentificare pe server pentru a preveni abuzul de API Gemini
  const { user } = await getUtilizatorCurent();
  if (!user) {
    return {
      ok: false,
      eroare: "Trebuie sa fii autentificat pentru a primi feedback si indrumare de la asistentul AI.",
    };
  }

  const supabase = await creeazaClientServer();
  const { data: dbMeta } = await supabase
    .from("users_meta")
    .select("subscription_status, ai_requests_today, last_ai_request_date")
    .eq("user_id", user.id)
    .maybeSingle();

  const azi = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  let requestsToday = dbMeta?.ai_requests_today ?? 0;
  const lastRequestDate = dbMeta?.last_ai_request_date ?? "";

  // Resetare contor daca s-a schimbat ziua de server
  if (lastRequestDate !== azi) {
    requestsToday = 0;
  }

  const isPremium = dbMeta?.subscription_status === "active";
  const limit = isPremium ? 15 : 1;

  if (requestsToday >= limit) {
    return {
      ok: false,
      eroare: isPremium
        ? "Ai atins limita zilnică de evaluări AI (15/zi). Te așteptăm mâine pentru noi provocări!"
        : "Ai atins limita zilnică de evaluări AI pentru contul gratuit (1/zi). Abonează-te la Premium pentru 15 evaluari zilnice!",
    };
  }

  const cod = (codElev || "").trim();
  const output = (outputRulare || "").trim();

  if (!cod) {
    return {
      ok: true,
      feedback: {
        scor: "Incomplet",
        analiza: "Nu ai scris încă niciun cod.",
        indrumare: "Scrie codul tău în editorul de deasupra și apoi cere evaluarea.",
        indiciu_sintaxa: "# Exemplu:\nprint('Salut')",
      },
    };
  }

  let geminiApiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (geminiApiKey.startsWith('"') && geminiApiKey.endsWith('"')) {
    geminiApiKey = geminiApiKey.slice(1, -1);
  }
  if (geminiApiKey.startsWith("'") && geminiApiKey.endsWith("'")) {
    geminiApiKey = geminiApiKey.slice(1, -1);
  }
  let eroareApelAPI: string | null = null;

  if (geminiApiKey) {
    try {
      const prompt = `
Ești un profesor asistent de informatică (tutor AI) pentru elevi de liceu din România.
Sarcina ta este să evaluezi codul Python scris de un elev pentru o problemă și să îi oferi îndrumare constructivă (fără a-i da direct codul complet rezolvat, ci ghidându-l să descopere singur greșeala).

Problema:
Titlu: "${titluProblema}"
Enunț: "${enuntProblema}"

Codul scris de elev:
\`\`\`python
${cod}
\`\`\`

Rezultatul rulării codului (output/eroare):
"${output}"

Te rog să analizezi codul și să răspunzi în limba română în format JSON, cu următoarele chei:
{
  "scor": "Un calificativ (ex: Excelent, Foarte Bine, Nevoie de corectare, Incomplet)",
  "analiza": "Ce a făcut bine elevul în cod.",
  "indrumare": "Ce greșeli are sau ce poate îmbunătăți. Fii cald, încurajator și oferă indicii clare, dar nu codul complet.",
  "indiciu_sintaxa": "Un mic fragment de cod sau sugestie de sintaxă dacă a greșit structura."
}
Răspunde DOAR cu obiectul JSON valid, fără alte texte înainte sau după.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      if (!response.ok) {
        let det = "";
        try { det = await response.text(); } catch (_) {}
        throw new Error(`Răspuns API invalid: ${response.status} ${response.statusText || ""}. Detalii: ${det}`);
      }

      const date = await response.json();
      const textRaspuns = date.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textRaspuns) {
        throw new Error("Nu s-a primit text de la model.");
      }

      const feedback = JSON.parse(textRaspuns) as FeedbackAI;

      // Increment contor AI in DB la apel reusit
      await supabase
        .from("users_meta")
        .update({
          ai_requests_today: requestsToday + 1,
          last_ai_request_date: azi,
        })
        .eq("user_id", user.id);

      return { ok: true, feedback };
    } catch (e: any) {
      console.error("Eroare evaluare Gemini:", e);
      eroareApelAPI = e?.message || String(e);
      // Fallback la evaluatorul local în caz de eroare API
    }
  }

  // --- EVALUATOR LOCAL (Fallback inteligent când cheia API lipsește sau dă eroare) ---
  const feedbackFallback: FeedbackAI = {
    scor: "Evaluat local",
    analiza: "Codul tău a fost preluat de asistentul local. Structura generală pare corectă.",
    indrumare: "Recomandare: Pentru un feedback complet inteligent (AI), roagă administratorul platformei să configureze cheia GEMINI_API_KEY pe server.",
    indiciu_sintaxa: "",
  };

  // Verificări bazate pe reguli statice
  const linii = cod.split("\n");
  let areLipsaDouaPuncte = false;

  for (const linie of linii) {
    const curat = linie.trim();
    if (
      (curat.startsWith("def ") ||
        curat.startsWith("if ") ||
        curat.startsWith("elif ") ||
        curat.startsWith("else") ||
        curat.startsWith("for ") ||
        curat.startsWith("while ")) &&
      !curat.endsWith(":")
    ) {
      areLipsaDouaPuncte = true;
      break;
    }
  }

  if (areLipsaDouaPuncte) {
    feedbackFallback.scor = "Eroare Sintaxă";
    feedbackFallback.analiza = "Ai început corect definirea unei structuri sau funcții.";
    feedbackFallback.indrumare = "Atenție! În Python, instrucțiunile de control (def, if, for, while, else) trebuie să se termine obligatoriu cu caracterul două puncte `:` la finalul liniei.";
    feedbackFallback.indiciu_sintaxa = "if conditie:\n    # codul tău";
  } else if (output.toLowerCase().includes("error") || output.toLowerCase().includes("exception")) {
    feedbackFallback.scor = "Eroare Rulare";
    feedbackFallback.analiza = "Codul se compilează, dar rulează cu erori în interpretor.";
    feedbackFallback.indrumare = `Interpretorul a raportat eroarea: "${output}". Verifică numele variabilelor utilizate și asigură-te că nu împarți la zero sau că nu accesezi un index greșit dintr-o listă.`;
  } else {
    feedbackFallback.scor = "Verificare Generală (Local)";
    feedbackFallback.analiza = "Codul rulează fără erori semnalate de consolă locală.";
    feedbackFallback.indrumare = eroareApelAPI 
      ? `Eroare apel API Google Gemini: "${eroareApelAPI}". Asigurați-vă că cheia este activă și are acces la Gemini 1.5 Flash.`
      : "Asistentul AI este momentan dezactivat. Vă rugăm asigurați-vă că variabila GEMINI_API_KEY este adăugată corect în Vercel și proiectul a fost redeploat.";
  }

  return { ok: true, feedback: feedbackFallback };
}
