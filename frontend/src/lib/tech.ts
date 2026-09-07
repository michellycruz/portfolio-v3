/**
 * O conteúdo guarda a tecnologia em minúsculas ("ts", "go"), que era a chave dos
 * ícones antigos. Aqui ela vira rótulo legível e ganha uma família de cor, que é
 * o que a legenda dos projetos usa: front, estilo, back e ferramenta.
 */
type TechFamily = "front" | "style" | "back" | "tool";

const families: Record<string, { label: string; family: TechFamily }> = {
  html: { label: "HTML", family: "front" },
  js: { label: "JavaScript", family: "front" },
  ts: { label: "TypeScript", family: "front" },
  react: { label: "React", family: "front" },
  css: { label: "CSS", family: "style" },
  sass: { label: "Sass", family: "style" },
  tailwind: { label: "Tailwind", family: "style" },
  bootstrap: { label: "Bootstrap", family: "style" },
  go: { label: "Go", family: "back" },
  php: { label: "PHP", family: "back" },
  sql: { label: "SQL", family: "back" },
  figma: { label: "Figma", family: "tool" },
  balsamiq: { label: "Balsamiq", family: "tool" },
  git: { label: "Git", family: "tool" },
  gitlab: { label: "GitLab", family: "tool" },
  // O conteúdo guarda "github-icon" desde a v2, quando a chave era o nome do
  // arquivo do ícone. As duas entradas ficam aqui em vez de a chave ser
  // renomeada no Go: um backend antigo no ar continua servindo a chave velha, e
  // ela precisa continuar virando rótulo em vez de aparecer crua na tela.
  "github-icon": { label: "GitHub", family: "tool" },
  github: { label: "GitHub", family: "tool" },
  excel: { label: "Excel", family: "tool" },
  word: { label: "Word", family: "tool" },
  outlook: { label: "Outlook", family: "tool" },
  teams: { label: "Teams", family: "tool" },
  notion: { label: "Notion", family: "tool" },
  ia: { label: "IA", family: "tool" },
};

const familyClasses: Record<TechFamily, string> = {
  front: "bg-yellow",
  style: "bg-pink",
  back: "bg-orange",
  tool: "bg-mint",
};

export const techLegend: { label: string; family: TechFamily }[] = [
  { label: "front-end", family: "front" },
  { label: "estilo", family: "style" },
  { label: "back-end", family: "back" },
  { label: "ferramenta", family: "tool" },
];

export function techLabel(key: string): string {
  return families[key]?.label ?? key;
}

export function techClass(key: string): string {
  return familyClasses[families[key]?.family ?? "tool"];
}

export function familyClass(family: TechFamily): string {
  return familyClasses[family];
}
