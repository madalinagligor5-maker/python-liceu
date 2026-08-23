import { getSublectieContinut } from "./src/lib/sublectii.js";

async function test() {
  console.log("=== Test încărcare conținut sublecții ===");
  try {
    const sub112 = await getSublectieContinut("1.1.2");
    console.log("Sublecția 1.1.2:");
    console.log("Existență:", !!sub112);
    if (sub112) {
      console.log("Titlu:", sub112.titlu);
      console.log("Număr blocuri:", sub112.blocuri.length);
    }

    const sub111 = await getSublectieContinut("1.1.1");
    console.log("\nSublecția 1.1.1:");
    console.log("Existență:", !!sub111);
    if (sub111) {
      console.log("Titlu:", sub111.titlu);
      console.log("Număr blocuri:", sub111.blocuri.length);
    }
  } catch (e) {
    console.error("Eroare la testare:", e);
  }
}

test();
