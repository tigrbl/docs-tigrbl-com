import fs from "node:fs";
import { execFileSync } from "node:child_process";
execFileSync("npx", ["vite", "build"], { stdio: "inherit", shell: process.platform === "win32" });
fs.writeFileSync("dist/robots.txt", "User-agent: *\nAllow: /\n");
fs.writeFileSync("dist/llms.txt", "# Tigrbl Docs\n\nThis documentation site is generated from the repository docs source.\n");
