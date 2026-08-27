import type { PyodideApi } from "@/types/pyodide";

let pyodidePromise: Promise<void> | null = null;

/**
 * Încarcă interpretorul Pyodide o singură dată per pagină și păstrează instanța
 * în window.__pyodideInstance pentru a preveni erorile de re-inițializare.
 */
export async function incarcaPyodide(): Promise<PyodideApi> {
  if (typeof window === "undefined") {
    throw new Error("Rularea locală Python nu este disponibilă pe server.");
  }
  if (window.__pyodideInstance) {
    return window.__pyodideInstance;
  }

  if (!pyodidePromise) {
    pyodidePromise = new Promise<void>((res, rej) => {
      const dejaIncarcat = document.querySelector("script[data-pyodide]");
      if (dejaIncarcat && window.loadPyodide) {
        res();
        return;
      }

      const s = (dejaIncarcat as HTMLScriptElement) ?? document.createElement("script");
      if (!dejaIncarcat) {
        s.src = "/pyodide/pyodide.js";
        s.setAttribute("data-pyodide", "1");
        document.body.appendChild(s);
      }

      const originalOnload = s.onload;
      s.onload = (e) => {
        if (originalOnload) (originalOnload as (...args: unknown[]) => void)(e);
        res();
      };

      const originalOnerror = s.onerror;
      s.onerror = (e) => {
        if (originalOnerror) (originalOnerror as (...args: unknown[]) => void)(e);
        s.remove();
        rej(new Error("Nu s-a putut încărca interpretorul Python."));
      };
    });
  }

  try {
    await pyodidePromise;
    if (!window.loadPyodide) {
      throw new Error("Scriptul Pyodide nu a expus loadPyodide.");
    }
    const py = await window.loadPyodide({ indexURL: "/pyodide/" });
    window.__pyodideInstance = py;
    return py;
  } catch (e) {
    // Resetăm promisiunea memorată — altfel orice reîncercare (ex. elevul
    // apasă din nou "Rulează codul" după o problemă de rețea trecătoare pe
    // mobil) ar relua la infinit exact același eșec inițial, fără să mai
    // încerce vreodată o încărcare nouă.
    pyodidePromise = null;
    throw e;
  }
}
