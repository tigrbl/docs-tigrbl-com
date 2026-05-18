import fs from "node:fs";
import path from "node:path";
const docs = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name.endsWith(".md")) docs.push(full);
  }
}
walk("docs");
if (!docs.length) throw new Error("No docs found");
for (const file of docs) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.match(/^#\s+/m)) throw new Error(`${file} is missing an H1`);
}
console.log(`docs ok: ${docs.length} markdown files`);
