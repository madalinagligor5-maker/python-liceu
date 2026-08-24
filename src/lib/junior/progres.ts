// ============================================================
// Academia Python Junior — Progres în localStorage
// ============================================================
import type { ProfilElev, ProgresNivel } from "./tipuri";

const KEY = "junior_profil";

export function getProfilElev(): ProfilElev | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProfilElev) : null;
  } catch {
    return null;
  }
}

export function salveazaProfil(profil: ProfilElev): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(profil));
}

export function creeazaProfil(avatar: number, nume: string): ProfilElev {
  const profil: ProfilElev = {
    id: crypto.randomUUID(),
    avatar,
    nume,
    module: {},
    createdAt: Date.now(),
  };
  salveazaProfil(profil);
  return profil;
}

export function stergereProfil(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

/** Înregistrează progresul unui nivel */
export function salveazaProgresNivel(
  modulId: string,
  nivelId: string,
  progres: ProgresNivel
): void {
  const profil = getProfilElev();
  if (!profil) return;

  if (!profil.module[modulId]) {
    profil.module[modulId] = { niveluri: {}, insignaDeblocata: false };
  }
  profil.module[modulId].niveluri[nivelId] = progres;
  salveazaProfil(profil);
}

/** Setează insigna unui modul ca deblocată */
export function deblocheazaInsigna(modulId: string): void {
  const profil = getProfilElev();
  if (!profil) return;
  if (!profil.module[modulId]) {
    profil.module[modulId] = { niveluri: {}, insignaDeblocata: false };
  }
  profil.module[modulId].insignaDeblocata = true;
  salveazaProfil(profil);
}

/** Returnează progresul unui nivel specific */
export function getProgresNivel(
  modulId: string,
  nivelId: string
): ProgresNivel {
  const profil = getProfilElev();
  return profil?.module[modulId]?.niveluri[nivelId] ?? {
    completat: false,
    stele: 0,
    incercari: 0,
  };
}

/** Verifică dacă primul nivel al unui modul este accesibil (modul deblocat) */
export function esteModulDeblocat(modulIndex: number): boolean {
  if (modulIndex === 1) return true; // Modulul 1 e mereu deblocat
  const profil = getProfilElev();
  if (!profil) return false;
  const modulAnterior = `M${modulIndex - 1}`;
  return !!profil.module[modulAnterior]?.insignaDeblocata;
}

/** Verifică dacă un nivel specific este accesibil */
export function esteNivelDeblocat(
  modulId: string,
  nivelNumar: number
): boolean {
  if (nivelNumar === 1) return true;
  const profil = getProfilElev();
  const nivelAntId = `${modulId}N${nivelNumar - 1}`;
  return !!profil?.module[modulId]?.niveluri[nivelAntId]?.completat;
}

/** Total stele acumulate */
export function totalStele(): number {
  const profil = getProfilElev();
  if (!profil) return 0;
  return Object.values(profil.module).reduce((sum, modul) => {
    return (
      sum +
      Object.values(modul.niveluri).reduce((s, n) => s + (n.stele ?? 0), 0)
    );
  }, 0);
}
