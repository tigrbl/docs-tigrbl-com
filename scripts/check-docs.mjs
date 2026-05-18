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
  const hasH1 = content.match(/^#\s+/m);
  const hasFrontmatterTitle = content.match(/^---[\s\S]*?\ntitle:\s*.+\n[\s\S]*?---/m);
  const isEmptyIndex = path.basename(file) === "index.md" && !content.trim();
  if (!hasH1 && !hasFrontmatterTitle && !isEmptyIndex) {
    throw new Error(`${file} is missing an H1 or frontmatter title`);
  }
}
console.log(`docs ok: ${docs.length} markdown files`);
