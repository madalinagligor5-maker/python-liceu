"use server";

import { creeazaClientServer } from "@/lib/supabase/server";

export type RezultatReview = {
  ok: boolean;
  eroare?: string;
};

/**
 * Salvează un review lăsat de un utilizator, după perioada de 7 zile gratuite.
 * Review-ul intră automat în tombola pentru 6 luni de abonament gratuit.
 */
export async function trimiteReview(
  stele: number,
  text: string,
  email?: string
): Promise<RezultatReview> {
  // Validare de bază (clientul nu e de încredere).
  if (!Number.isInteger(stele) || stele < 1 || stele > 5) {
    return { ok: false, eroare: "Te rugăm să alegi un număr de stele între 1 și 5." };
  }
  const textCurat = (text ?? "").trim();
  if (textCurat.length < 10) {
    return { ok: false, eroare: "Te rugăm să lași un review de cel puțin 10 caractere." };
  }

  try {
    const supabase = await creeazaClientServer();
    const { error } = await supabase.from("reviewuri").insert({
      stele,
      text: textCurat,
      email: email?.trim() || null,
      creat_la: new Date().toISOString(),
    });
    if (error) {
      return { ok: false, eroare: "Nu am putut salva review-ul. Încearcă din nou." };
    }
    return { ok: true };
  } catch {
    return { ok: false, eroare: "A apărut o eroare neașteptată. Încearcă din nou." };
  }
}
