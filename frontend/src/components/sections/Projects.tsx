import { useMemo, useState } from "react";
import { ExternalLink, Lock } from "lucide-react";
import type { Project } from "../../types/content";
import { familyClass, techClass, techLabel, techLegend } from "../../lib/tech";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";
import { SocialIcon } from "../ui/SocialIcon";

const ALL = "todos";

/** Cores do bloco que entra no lugar da captura de tela. */
const placeholderTones = ["bg-orange", "bg-pink", "bg-mint", "bg-yellow"];

interface ProjectsProps {
  items: Project[];
}

export function Projects({ items }: ProjectsProps) {
  const [filter, setFilter] = useState(ALL);

  // O filtro sai da própria lista de projetos, e não de uma lista fixa: só entra
  // a tecnologia que aparece em mais de um projeto, senão a fileira de botões
  // fica do tamanho da grade.
  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const tech of item.tech) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    const recurring = [...counts.entries()]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([tech]) => tech);

    return [ALL, ...recurring];
  }, [items]);

  const visible = filter === ALL ? items : items.filter((item) => item.tech.includes(filter));

  return (
    <section id="projetos" className="flex scroll-mt-24 flex-col gap-5">
      <SectionHeading title="Projetos" kicker={`${items.length} no total`} />

      <div className="flex flex-wrap gap-2">
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`rounded-full border-2 px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-transform duration-150 hover:-translate-y-px ${
              filter === option ? "border-stroke-soft bg-ink text-bg" : "border-stroke bg-panel text-ink"
            }`}
          >
            {option === ALL ? "Todos" : techLabel(option)}
          </button>
        ))}
      </div>

      <ul className="flex flex-wrap gap-3.5 font-mono text-[10.5px] tracking-[0.05em] text-muted">
        {techLegend.map((entry) => (
          <li key={entry.label} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-[2px] ${familyClass(entry.family)}`} />
            {entry.label}
          </li>
        ))}
      </ul>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => (
          <Card key={project.title} interactive className="flex flex-col gap-3 p-4">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt=""
                loading="lazy"
                className="aspect-[16/10] w-full rounded-xl border-2 border-stroke object-cover"
              />
            ) : (
              // Nem todo projeto tem captura (os privados não têm). Em vez de um
              // buraco no cartão, entra um bloco em cor cheia com as iniciais —
              // assim a grade continua alinhada.
              <div
                aria-hidden="true"
                className={`grid aspect-[16/10] w-full place-items-center rounded-xl border-2 border-stroke-soft font-display text-3xl text-on-accent ${
                  placeholderTones[index % placeholderTones.length]
                }`}
              >
                {project.title
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0]?.toUpperCase())
                  .join("")}
              </div>
            )}

            <div className="flex items-start justify-between gap-2.5">
              <h3 className="text-[17px] leading-tight">{project.title}</h3>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{project.year}</span>
            </div>

            <p className="flex-1 text-sm text-muted">{project.description}</p>

            <ul className="flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.08em] text-on-accent uppercase ${techClass(tech)}`}
                >
                  {techLabel(tech)}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4 border-t-2 border-dashed border-stroke-soft pt-2.5 font-mono text-[11px] tracking-[0.06em] uppercase">
              {project.private ? (
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  Privado
                </span>
              ) : (
                <>
                  {project.linkUrl && (
                    <a
                      href={project.linkUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 border-b-2 border-orange"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                      Ver projeto
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 border-b-2 border-orange"
                    >
                      <SocialIcon name="github" className="h-3.5 w-3.5" />
                      Código
                    </a>
                  )}
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
