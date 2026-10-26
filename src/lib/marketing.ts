/**
 * Acordul pentru emailuri de marketing (oferte, reduceri — ex. Black Friday).
 *
 * Se păstrează în `user_metadata` din Supabase Auth, nu în users_meta: așa nu
 * e nevoie de o migrare a bazei de date, iar utilizatorul își poate schimba
 * singur acordul (supabase.auth.updateUser). GDPR: implicit NU există acord;
 * îl dă doar bifând explicit căsuța la înregistrare sau din pagina de cont.
 */
export const CHEIE_ACORD = "accept_marketing";
export const CHEIE_ACORD_LA = "accept_marketing_la";

export function dateAcordMarketing(accept: boolean) {
  return { [CHEIE_ACORD]: accept, [CHEIE_ACORD_LA]: new Date().toISOString() };
}

export function areAcordMarketing(metadata: Record<string, unknown> | null | undefined): boolean {
  return metadata?.[CHEIE_ACORD] === true;
}
