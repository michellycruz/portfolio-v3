import type { Experience as ExperienceItem } from "../../types/content";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";

interface ExperienceProps {
  items: ExperienceItem[];
}

export function Experience({ items }: ExperienceProps) {
  return (
    <section id="experiencia" className="flex scroll-mt-24 flex-col gap-5">
      <SectionHeading
        title="Experiência"
        kicker={`${items.length} ${items.length === 1 ? "posição" : "posições"}`}
      />

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Card key={`${item.company}-${item.period}`} className="grid gap-5 md:grid-cols-[170px_minmax(0,1fr)]">
            <div className="font-mono text-[11.5px] tracking-[0.04em] text-muted">
              <b className="mb-0.5 block text-[12.5px] text-ink">{item.period}</b>
              {item.company}
            </div>

            <div>
              <h3 className="text-[19px]">{item.company}</h3>
              <p className="mt-0.5 font-mono text-xs tracking-[0.06em] text-orange uppercase">{item.role}</p>

              <ul className="mt-3 flex flex-col gap-1.5">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="relative pl-5 text-[14.5px] text-muted">
                    <span
                      aria-hidden="true"
                      className="absolute top-2 left-0 h-2 w-2 rounded-[2px] border border-stroke-soft bg-yellow"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>

              {item.results && (
                <p className="mt-4 rounded-r-xl border-l-4 border-mint bg-panel-2 px-3.5 py-3 text-sm">
                  <b className="mb-0.5 block font-mono text-[10.5px] tracking-[0.14em] text-mint uppercase">
                    Resultados
                  </b>
                  {item.results}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
