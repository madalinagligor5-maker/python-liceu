export type RolUtilizator =
  | "elev"
  | "profesor_in_asteptare"
  | "profesor_aprobat"
  | "profesor_revocat";

/**
 * Contul de admin (fondatoarea) e identificat prin variabila de mediu
 * ADMIN_EMAIL, comparată server-side — niciodată doar în UI. Nu există alt
 * tipar de cont „special" în schema existentă (vezi users_meta), așa că nu
 * inventăm o coloană nouă de rol de admin doar pentru un singur cont.
 */
export function esteAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}
