// Os totais que o site mostra, antes e depois da mudança em andamento: roda as
// mesmas funções de src/lib/courses.ts sobre o portfolio.json do último commit
// e sobre o da cópia de trabalho. Se uma mudança mexe num total mais do que o
// próprio item justifica, aparece aqui antes de ir ao ar.
//
//   npm run totais
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { coursesByArea, studyTotals } from "../src/lib/courses.ts";
import type { Content } from "../src/types/content.ts";

const file = "backend/internal/content/portfolio.json";
const root = fileURLToPath(new URL("../../", import.meta.url));

function lastCommit(): Content | undefined {
  try {
    const json = execFileSync("git", ["show", `HEAD:${file}`], { cwd: root, encoding: "utf8", stdio: "pipe" });
    return JSON.parse(json) as Content;
  } catch {
    return undefined; // o arquivo ainda não existe no último commit
  }
}

function summary(content: Content): Map<string, string> {
  const n = (value: number) => value.toLocaleString("pt-BR");
  const totals = studyTotals(content.institutions);
  const rows = new Map([
    ["Cursos concluídos", n(totals.courses)],
    ["Horas de estudo", `${n(totals.hours)}h`],
    ["Sem carga declarada", n(totals.missingHours)],
  ]);
  for (const { area, count } of coursesByArea(content.institutions)) rows.set(`  ${area}`, n(count));
  return rows;
}

const before = lastCommit();
const after = summary(JSON.parse(readFileSync(`${root}/${file}`, "utf8")) as Content);
const old = before ? summary(before) : new Map<string, string>();

const labels = [...new Set([...after.keys(), ...old.keys()])];
const width = Math.max(...labels.map((label) => label.length));
console.log(`${"".padEnd(width)}  ${"commit".padStart(8)}     ${"agora".padStart(8)}`);
for (const label of labels) {
  const a = old.get(label) ?? "-";
  const b = after.get(label) ?? "-";
  const mark = before && a !== b ? "   ← mudou" : "";
  console.log(`${label.padEnd(width)}  ${a.padStart(8)}  →  ${b.padStart(8)}${mark}`);
}
