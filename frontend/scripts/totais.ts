// Os totais que o site mostra, antes e depois da mudança em andamento. A coluna
// "commit" roda o courses.ts do último commit sobre o portfolio.json do último
// commit; a coluna "agora" roda os dois da cópia de trabalho. Assim, se uma
// mudança no conteúdo ou na própria regra de contagem mexe num total mais do
// que devia, isso aparece aqui antes de ir ao ar.
//
//   npm run totais   (Node 22.18 ou mais novo, que roda .ts direto)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as current from "../src/lib/courses.ts";
import type { Content } from "../src/types/content.ts";

type Rules = typeof current;

const root = fileURLToPath(new URL("../../", import.meta.url));
const contentFile = "backend/internal/content/portfolio.json";
const rulesFile = "frontend/src/lib/courses.ts";

function atHead(file: string): string {
  return execFileSync("git", ["show", `HEAD:${file}`], { cwd: root, encoding: "utf8", stdio: "pipe" });
}

// A regra do último commit roda de um arquivo temporário. Ela só importa tipos,
// que o Node apaga, então não precisa de mais nada do repositório.
async function rulesAtHead(): Promise<Rules> {
  const dir = mkdtempSync(join(tmpdir(), "totais-"));
  try {
    const file = join(dir, "courses.mts");
    writeFileSync(file, atHead(rulesFile));
    return (await import(pathToFileURL(file).href)) as Rules;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function lastCommit(): Promise<{ content: Content; rules: Rules } | undefined> {
  let content: Content;
  try {
    content = JSON.parse(atHead(contentFile)) as Content;
  } catch {
    return undefined; // o arquivo ainda não existe no último commit
  }
  try {
    return { content, rules: await rulesAtHead() };
  } catch {
    console.error("aviso: não deu para carregar o courses.ts do último commit; a coluna commit usa a regra atual.\n");
    return { content, rules: current };
  }
}

function summary(content: Content, rules: Rules): Map<string, string> {
  const n = (value: number) => value.toLocaleString("pt-BR");
  const totals = rules.studyTotals(content.institutions);
  const rows = new Map([
    ["Cursos concluídos", n(totals.courses)],
    ["Horas de estudo", `${n(totals.hours)}h`],
    ["Sem carga declarada", n(totals.missingHours)],
  ]);
  for (const { area, count } of rules.coursesByArea(content.institutions)) rows.set(`  ${area}`, n(count));
  return rows;
}

const before = await lastCommit();
const after = summary(JSON.parse(readFileSync(join(root, contentFile), "utf8")) as Content, current);
const old = before ? summary(before.content, before.rules) : new Map<string, string>();

const labels = [...new Set([...after.keys(), ...old.keys()])];
const width = Math.max(...labels.map((label) => label.length));
console.log(`${"".padEnd(width)}  ${"commit".padStart(8)}     ${"agora".padStart(8)}`);
for (const label of labels) {
  const a = old.get(label) ?? "-";
  const b = after.get(label) ?? "-";
  const mark = before && a !== b ? "   ← mudou" : "";
  console.log(`${label.padEnd(width)}  ${a.padStart(8)}  →  ${b.padStart(8)}${mark}`);
}
