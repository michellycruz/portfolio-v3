import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Lock } from "lucide-react";
import type { Project } from "../../types/content";
import { familyClass, techClass, techLabel, techLegend } from "../../lib/tech";
import { SectionHeading } from "../ui/SectionHeading";
import { SocialIcon } from "../ui/SocialIcon";

const ALL = "todos";

/** Cores do bloco que entra no lugar da captura de tela. */
const placeholderTones = ["bg-orange", "bg-pink", "bg-mint", "bg-yellow"];

interface YearGroup {
  year: string;
  items: Project[];
}

/** Os projetos chegam do mais recente para o mais antigo e a linha do tempo
 *  mantém essa ordem, igual à seção de experiência: quem chega vê primeiro o
 *  que é de agora e arrasta para trás no tempo. */
function groupByYear(items: Project[]): YearGroup[] {
  const groups: YearGroup[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last && last.year === item.year) last.items.push(item);
    else groups.push({ year: item.year, items: [item] });
  }
  return groups;
}

interface ProjectsProps {
  items: Project[];
}

export function Projects({ items }: ProjectsProps) {
  const [filter, setFilter] = useState(ALL);

  // O filtro sai da própria lista de projetos, e não de uma lista fixa: só entra
  // a tecnologia que aparece em mais de um projeto, senão a fileira de botões
  // fica do tamanho da linha do tempo.
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

  const visible = useMemo(
    () => (filter === ALL ? items : items.filter((item) => item.tech.includes(filter))),
    [items, filter],
  );
  const groups = useMemo(() => groupByYear(visible), [visible]);

  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [activeYear, setActiveYear] = useState("");

  const readTimeline = useCallback(() => {
    const el = scroller.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });

    // O ano em destaque é o do último marco que já passou pela borda esquerda:
    // é dele que são os cartões que estão sendo lidos agora. Os marcos estão em
    // ordem no DOM, então o último que satisfaz a condição é o certo.
    const edge = el.getBoundingClientRect().left + 56;
    let current = "";
    for (const marker of el.querySelectorAll<HTMLElement>("[data-year]")) {
      if (marker.getBoundingClientRect().left <= edge) current = marker.dataset.year ?? "";
    }
    setActiveYear(current);
  }, []);

  // Trocar o filtro reescreve a linha do tempo: volta ao começo, senão a lista
  // nova aparece já rolada no meio, num ano que talvez nem exista mais.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = 0;
    readTimeline();
  }, [groups, readTimeline]);

  useEffect(() => {
    window.addEventListener("resize", readTimeline);
    return () => window.removeEventListener("resize", readTimeline);
  }, [readTimeline]);

  // Uma "página" é a largura visível menos um respiro, para o cartão que estava
  // na borda continuar aparecendo depois do salto e não se perder o contexto.
  function nudge(direction: -1 | 1) {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * (el.clientWidth - 80), behavior: "smooth" });
  }

  // Sem barra de rolagem, arrastar precisa funcionar de verdade: guarda onde o
  // ponteiro desceu e o quanto a lista já estava rolada, e move a diferença.
  const drag = useRef({ down: false, startX: 0, startLeft: 0, dragging: false });

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Toque e caneta continuam com a rolagem nativa, que já é melhor que
    // qualquer coisa reimplementada aqui.
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const el = scroller.current;
    if (!el) return;
    drag.current = { down: true, startX: event.clientX, startLeft: el.scrollLeft, dragging: false };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = scroller.current;
    if (!el || !drag.current.down) return;

    const dx = event.clientX - drag.current.startX;

    // Cinco pixels de folga: um clique com a mão trêmida continua sendo clique,
    // e os atalhos de deploy e repositório seguem clicáveis.
    if (!drag.current.dragging) {
      if (Math.abs(dx) < 5) return;
      drag.current.dragging = true;
      el.setPointerCapture(event.pointerId);
      el.style.userSelect = "none";
    }

    el.scrollLeft = drag.current.startLeft - dx;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const el = scroller.current;
    if (el) {
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      el.style.userSelect = "";
    }
    drag.current.down = false;
  }

  // Soltar o ponteiro no fim de um arrasto dispara click no cartão que estava
  // embaixo. Este capture engole esse click — e só ele.
  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!drag.current.dragging) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.dragging = false;
  }

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

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <ul className="flex flex-wrap gap-3.5 font-mono text-[10.5px] tracking-[0.05em] text-muted">
          {techLegend.map((entry) => (
            <li key={entry.label} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-[2px] ${familyClass(entry.family)}`} />
              {entry.label}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10.5px] tracking-[0.05em] text-muted sm:block">
            arraste para o lado
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={edges.start}
              aria-label="Ver projetos mais recentes"
              className="rounded-full border-2 border-stroke bg-panel p-1.5 transition-transform duration-150 enabled:hover:-translate-y-px disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={edges.end}
              aria-label="Ver projetos mais antigos"
              className="rounded-full border-2 border-stroke bg-panel p-1.5 transition-transform duration-150 enabled:hover:-translate-y-px disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={readTimeline}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        tabIndex={0}
        role="group"
        aria-label="Linha do tempo dos projetos: arraste para o lado ou use as setas"
        // snap-proximity, e não mandatory: com mandatory a lista puxava de volta
        // no meio do arrasto. A barra some porque a navegação é pelo arrasto e
        // pelas setas — as setas do teclado continuam rolando. O padding é o
        // respiro que a sombra dura dos cartões precisa para não ser cortada.
        className="-mx-2 cursor-grab snap-x snap-proximity overflow-x-auto px-2 pt-1 pb-4 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max items-stretch gap-8">
          {groups.map((group, groupIndex) => (
            <div key={group.year} className="flex flex-col gap-4">
              {/* O marco do ano puxa o eixo até dentro do vão que separa os
                  grupos (-mr-8), então a linha atravessa a seção inteira em vez
                  de picar num traço por ano. */}
              <div data-year={group.year} className="-mr-8 flex items-center gap-3">
                {/* O ano gruda na borda esquerda enquanto os cartões dele passam
                    e é empurrado para fora pelo ano seguinte: sem isso, arrastar
                    para o meio de um ano deixava a linha sem rótulo nenhum. */}
                <span
                  className={`sticky left-0 z-10 rounded-full border-2 px-3 py-0.5 font-mono text-[13px] font-bold tabular-nums transition-colors duration-200 ${
                    group.year === activeYear
                      ? "border-stroke-soft bg-orange text-on-accent shadow-brutal-sm"
                      : "border-stroke bg-panel text-muted"
                  }`}
                >
                  {group.year}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-0.5 flex-1 rounded-sm transition-colors duration-200 ${
                    group.year === activeYear ? "bg-orange" : "bg-stroke-soft opacity-40"
                  }`}
                />
              </div>

              <div className="flex flex-1 items-stretch gap-4">
                {group.items.map((project, itemIndex) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    tone={placeholderTones[(groupIndex * 3 + itemIndex) % placeholderTones.length]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, tone }: { project: Project; tone: string }) {
  return (
    <article className="flex w-[290px] shrink-0 snap-start flex-col gap-3 rounded-2xl border-2 border-stroke bg-panel p-4 shadow-brutal transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
      {project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt=""
          loading="lazy"
          draggable={false}
          className="aspect-[16/10] w-full rounded-xl border-2 border-stroke object-cover"
        />
      ) : (
        // Nem todo projeto tem captura (os privados não têm). Em vez de um
        // buraco no cartão, entra um bloco em cor cheia com as iniciais —
        // assim a faixa continua alinhada.
        <div
          aria-hidden="true"
          className={`grid aspect-[16/10] w-full place-items-center rounded-xl border-2 border-stroke-soft font-display text-3xl text-on-accent ${tone}`}
        >
          {project.title
            .split(" ")
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join("")}
        </div>
      )}

      <h3 className="text-[17px] leading-tight">{project.title}</h3>

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
                draggable={false}
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
                draggable={false}
                className="inline-flex items-center gap-1.5 border-b-2 border-orange"
              >
                <SocialIcon name="github" className="h-3.5 w-3.5" />
                Código
              </a>
            )}
          </>
        )}
      </div>
    </article>
  );
}
