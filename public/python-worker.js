/* eslint-disable */
/**
 * Web Worker care rulează codul Python al elevului (Pyodide), separat de firul
 * principal al paginii. Motivul: o buclă infinită rulată pe firul principal
 * îngheață complet pagina (butoanele, derularea, chiar și un setTimeout de
 * protecție nu se mai execută). Aici, pagina rămâne responsivă, iar firul
 * principal poate opri execuția oricând, terminând worker-ul.
 *
 * Protocol (postMessage):
 *   pagină -> worker: { tip: "ruleaza", id, cod, intrare }
 *   worker -> pagină: { tip: "gata-incarcare" } | { tip: "eroare-incarcare", mesaj }
 *                     { tip: "start", id } | { tip: "stdout"|"stderr", id, text }
 *                     { tip: "final", id, ok, eroare?, trunchiat }
 */

var LIMITA_OUTPUT = 20000; // caractere; peste limită, restul ieșirii e ignorat
var pyodidePromise = null;

function incarca() {
  if (!pyodidePromise) {
    pyodidePromise = (async function () {
      importScripts("/pyodide/pyodide.js");
      var py = await self.loadPyodide({ indexURL: "/pyodide/" });
      return py;
    })();
  }
  return pyodidePromise;
}

/** Păstrează din traceback doar cadrele din codul elevului ("<exec>"). */
function curataTraceback(mesaj) {
  var linii = String(mesaj || "").split("\n");
  var start = -1;
  for (var i = 0; i < linii.length; i++) {
    if (linii[i].indexOf('File "<exec>"') !== -1) {
      start = i;
      break;
    }
  }
  var utile = start === -1 ? linii : linii.slice(start);
  // Eliminăm cadrele interne Pyodide care pot apărea după cele ale elevului.
  var rezultat = [];
  var sari = false;
  for (var j = 0; j < utile.length; j++) {
    var l = utile[j];
    if (/^\s*File "\/lib\//.test(l)) {
      sari = true;
      continue;
    }
    if (sari && /^\s{4,}/.test(l)) continue;
    sari = false;
    rezultat.push(l);
  }
  return rezultat.join("\n").trim();
}

function extrageLinie(text) {
  var gasite = String(text).match(/File "<exec>", line (\d+)/g);
  if (!gasite || !gasite.length) return null;
  var ultima = gasite[gasite.length - 1].match(/line (\d+)/);
  return ultima ? Number(ultima[1]) : null;
}

function extrageTip(text) {
  var linii = String(text).trim().split("\n");
  var ultima = linii[linii.length - 1] || "";
  var m = ultima.match(/^([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception|Interrupt|Exit))\b:?\s*(.*)$/);
  return m ? { tip: m[1], detaliu: m[2] || "" } : { tip: "Eroare", detaliu: ultima };
}

self.onmessage = async function (e) {
  var msg = e.data || {};
  if (msg.tip === "preincarca") {
    try {
      await incarca();
      self.postMessage({ tip: "gata-incarcare" });
    } catch (err) {
      self.postMessage({ tip: "eroare-incarcare", mesaj: String((err && err.message) || err) });
    }
    return;
  }
  if (msg.tip !== "ruleaza") return;

  var id = msg.id;
  var py;
  try {
    py = await incarca();
    self.postMessage({ tip: "gata-incarcare" });
  } catch (err) {
    pyodidePromise = null;
    self.postMessage({ tip: "eroare-incarcare", mesaj: String((err && err.message) || err) });
    return;
  }

  var scrise = 0;
  var trunchiat = false;
  function emite(tipFlux) {
    return function (text) {
      if (trunchiat) return;
      var t = text + "\n";
      if (scrise + t.length > LIMITA_OUTPUT) {
        trunchiat = true;
        t = t.slice(0, Math.max(0, LIMITA_OUTPUT - scrise));
      }
      scrise += t.length;
      if (t) self.postMessage({ tip: tipFlux, id: id, text: t });
    };
  }

  var liniiIntrare = String(msg.intrare || "")
    .replace(/\r/g, "")
    .split("\n");
  // Un rând gol final (de la Enter) nu e o intrare în plus.
  if (liniiIntrare.length && liniiIntrare[liniiIntrare.length - 1] === "") liniiIntrare.pop();
  var indexIntrare = 0;

  py.setStdout({ batched: emite("stdout") });
  py.setStderr({ batched: emite("stderr") });
  py.setStdin({
    stdin: function () {
      if (indexIntrare < liniiIntrare.length) return liniiIntrare[indexIntrare++];
      return null; // EOF -> input() aruncă EOFError, explicat elevului mai jos
    },
  });

  // Spațiu de nume nou la fiecare rulare: variabilele unui exercițiu anterior
  // nu mai pot face „să treacă" un cod greșit.
  var spatiu = py.globals.get("dict")();
  self.postMessage({ tip: "start", id: id });
  try {
    await py.runPythonAsync(String(msg.cod || ""), { globals: spatiu });
    self.postMessage({ tip: "final", id: id, ok: true, trunchiat: trunchiat });
  } catch (err) {
    var brut = String((err && err.message) || err);
    var tb = curataTraceback(brut);
    var tip = extrageTip(tb);
    self.postMessage({
      tip: "final",
      id: id,
      ok: false,
      trunchiat: trunchiat,
      eroare: { tip: tip.tip, detaliu: tip.detaliu, linie: extrageLinie(brut), traceback: tb },
    });
  } finally {
    try {
      spatiu.destroy();
    } catch (_) {}
  }
};
