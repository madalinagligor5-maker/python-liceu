"use server";

export type FeedbackAI = {
  scor: string;
  analiza: string;
  indrumare: string;
  indiciu_sintaxa: string;
};

export async function evalueazaCodCuAI(
  titluProblema: string,
  enuntProblema: string,
  codElev: string,
  outputRulare: string
): Promise<{ ok: boolean; feedback?: FeedbackAI; eroare?: string }> {
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

  const geminiApiKey = process.env.GEMINI_API_KEY;

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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
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
        throw new Error(`Răspuns API invalid: ${response.statusText}`);
      }

      const date = await response.json();
      const textRaspuns = date.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textRaspuns) {
        throw new Error("Nu s-a primit text de la model.");
      }

      const feedback = JSON.parse(textRaspuns) as FeedbackAI;
      return { ok: true, feedback };
    } catch (e) {
      console.error("Eroare evaluare Gemini:", e);
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
    feedbackFallback.scor = "Verificare Generală";
    feedbackFallback.analiza = "Codul rulează fără erori semnalate de consolă.";
    feedbackFallback.indrumare = "Dacă rezultatul obținut în consolă corespunde cerinței problemei, poți trece la modulul următor! Nu uita să testezi și cazuri de margine (cum ar fi liste goale sau valori negative).";
  }

  return { ok: true, feedback: feedbackFallback };
}
