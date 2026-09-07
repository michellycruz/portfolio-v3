import type { InfraSkill, SkillCategory } from "../../types/content";
import { techClass, techLabel } from "../../lib/tech";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";

interface SkillsProps {
  categories: SkillCategory[];
  infraSkills: InfraSkill[];
}

/** Rótulo curto de bloco. A seção mostra duas coisas diferentes — o que ela usa
 *  e onde ela atua — e sem esta divisa as duas chegavam com o mesmo peso. */
function BlockLabel({ children }: { children: string }) {
  return (
    <h3 className="font-mono text-[10.5px] tracking-[0.16em] text-muted uppercase">{children}</h3>
  );
}

export function Skills({ categories, infraSkills }: SkillsProps) {
  // As categorias vêm com 1, 2, 9 e 10 itens. Num cartão cada, a de um item
  // era esticada até a altura da de dez e virava uma caixa de ar; em linha, cada
  // uma ocupa o que precisa e a diferença de tamanho deixa de ser um buraco.
  const withSkills = categories.filter((category) => category.skills.length > 0);

  return (
    <section id="habilidades" className="flex scroll-mt-24 flex-col gap-7">
      <SectionHeading title="Habilidades" kicker="Dev + infra" />

      <div className="flex flex-col gap-3">
        <BlockLabel>O que uso</BlockLabel>

        <Card className="flex flex-col gap-0 p-0">
          {withSkills.map((category, index) => (
            <div
              key={category.title}
              className={`grid gap-x-4 gap-y-2 px-4 py-3.5 sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:items-baseline ${
                index > 0 ? "border-t-2 border-dashed border-stroke-soft" : ""
              }`}
            >
              <h4 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
                {category.title}
              </h4>

              <ul className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className={`rounded-md px-2 py-0.5 font-mono text-[10.5px] font-bold tracking-[0.06em] text-on-accent uppercase ${techClass(skill)}`}
                  >
                    {techLabel(skill)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <BlockLabel>Onde atuo</BlockLabel>

        <div className="grid gap-4 md:grid-cols-3">
          {infraSkills.map((skill) => (
            <Card key={skill.title} className="flex flex-col gap-2.5 p-4">
              <h4 className="font-display text-[15.5px] leading-tight">{skill.title}</h4>
              <p className="text-sm text-muted">{skill.description}</p>

              {skill.highlights.length > 0 && (
                // As tarefas moram dentro da área a que pertencem. Soltas no fim
                // da seção, eram oito frases em cápsula sem dono — e no celular
                // cada uma quebrava em duas linhas dentro do arredondado.
                <ul className="mt-0.5 flex flex-col gap-1.5 border-t-2 border-dashed border-stroke-soft pt-2.5">
                  {skill.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-[13px] leading-snug text-muted">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-orange" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
