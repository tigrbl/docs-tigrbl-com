import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const pages = import.meta.glob("../docs/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const ordered = Object.entries(pages).sort(([a], [b]) => a.localeCompare(b));
function titleFor(path: string, markdown: string) { return markdown.match(/^#\s+(.+)$/m)?.[1] ?? path.split("/").pop()?.replace(/\.md$/, "") ?? "Docs"; }
function slugFor(path: string) { return path.replace("../docs", "").replace(/index\.md$/, "").replace(/\.md$/, "/").replace(/\/+/g, "/") || "/"; }
function markdownToHtml(markdown: string) {
  return markdown
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/```bash\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>");
}
function App() {
  const selected = ordered.find(([entry]) => slugFor(entry) === window.location.pathname) ?? ordered[0];
  const [, markdown] = selected;
  return (
    <div className="docs-shell">
      <aside><strong>Tigrbl Docs</strong><nav>{ordered.map(([entry, content]) => <a key={entry} href={slugFor(entry)}>{titleFor(entry, content)}</a>)}</nav></aside>
      <main><article dangerouslySetInnerHTML={{ __html: `<p>${markdownToHtml(markdown)}</p>` }} /></main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
