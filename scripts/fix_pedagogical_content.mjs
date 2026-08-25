import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");
const mainFiles = fs.readdirSync(contentDir).filter(f => f.startsWith("lectii_") && f.endsWith(".md"));

for (const file of mainFiles) {
  const filePath = path.join(contentDir, file);
  let text = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");
  let modified = false;

  const modulBlocks = text.split(/(?=# Modulul )/g);

  const newBlocks = modulBlocks.map(block => {
    if (!block.startsWith("# Modulul ")) return block;

    const firstLine = block.split("\n")[0];
    const codMatch = firstLine.match(/# Modulul\s+(\d+\.\d+|P\d+\.\d+|P7\.1)/);
    if (!codMatch) return block;

    const codModul = codMatch[1];
    if (codModul.startsWith("4.")) {
      const nr = parseInt(codModul.split(".")[1], 10);
      if (nr >= 18) return block; // Skip ML 4.18+
    }

    let b = block;

    // Asigurăm casetă :::tip în Concept nou dacă lipsește
    if (b.includes("### 💡") && !/:::(tip|exemplu|atentie)/.test(b.split("### 🔮")[0] || "")) {
      b = b.replace(
        /(### 💡[^\n]*\n)/,
        `$1\n:::tip\n## Sfaturi & Bune Practici Didactice\nVerifică întotdeauna tipul variabilelor și indentarea corectă a liniilor de cod.\n:::\n\n`
      );
      modified = true;
    }

    return b;
  });

  if (modified) {
    fs.writeFileSync(filePath, newBlocks.join(""), "utf-8");
  }
}
