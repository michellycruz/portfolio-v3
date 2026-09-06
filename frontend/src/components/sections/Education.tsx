import type { Education as EducationItem, Institution } from "../../types/content";
import { Card } from "../ui/Card";
import { FormationChart } from "../ui/FormationChart";
import { InstitutionAccordion } from "../ui/InstitutionAccordion";
import { SectionHeading } from "../ui/SectionHeading";
import { StudyStats } from "../ui/StudyStats";

interface EducationProps {
  items: EducationItem[];
  institutions: Institution[];
}

export function Education({ items, institutions }: EducationProps) {
  return (
    <section id="formacao" className="flex scroll-mt-24 flex-col gap-5">
      <SectionHeading title="Formação" kicker="Acadêmica + cursos" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.course} className="flex flex-col gap-2">
            {item.hours && (
              <span className="w-fit rounded-full border-2 border-stroke-soft bg-mint px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.1em] text-on-accent uppercase">
                {item.hours}
              </span>
            )}
            <h3 className="text-[16.5px] leading-tight">{item.course}</h3>
            <p className="text-[13.5px] text-muted">{item.institution}</p>
            <span className="mt-1 font-mono text-[11px] tracking-[0.05em] text-muted">{item.period}</span>
          </Card>
        ))}
      </div>

      {/* Cursos e certificações: total primeiro, a lista por instituição fechada
          logo abaixo (são quase sessenta cursos — abertos, eles engoliriam a
          seção) e o recorte por área no fim. */}
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="text-xl">Cursos e certificações</h3>
          <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted uppercase">
            Toque para abrir cada instituição
          </span>
        </div>

        <StudyStats institutions={institutions} />

        <InstitutionAccordion institutions={institutions} />

        <div className="border-t-2 border-dashed border-stroke-soft pt-4">
          <FormationChart institutions={institutions} />
        </div>
      </Card>
    </section>
  );
}
