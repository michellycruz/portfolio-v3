import type { InfraSkill, SkillCategory } from "../../types/content";
import { techLabel } from "../../lib/tech";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";

const chipBorders = ["border-yellow", "border-pink", "border-orange", "border-mint"];

interface SkillsProps {
  categories: SkillCategory[];
  infraSkills: InfraSkill[];
  infraHighlights: string[];
}

export function Skills({ categories, infraSkills, infraHighlights }: SkillsProps) {
  return (
    <section id="habilidades" className="flex scroll-mt-24 flex-col gap-5">
      <SectionHeading title="Habilidades" kicker="Dev + infra" />

      <div className="grid gap-4 lg:grid-cols-2">
        {categories.map((category, categoryIndex) => (
          <Card key={category.title} className="flex flex-col gap-3">
            <h3 className="text-[15px]">{category.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <li
                  key={skill}
                  className={`rounded-lg border-2 bg-panel-2 px-2.5 py-1.5 font-mono text-[11.5px] ${
                    chipBorders[(categoryIndex + skillIndex) % chipBorders.length]
                  }`}
                >
                  {techLabel(skill)}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {infraSkills.map((skill) => (
          <Card key={skill.title} className="flex flex-col gap-1.5">
            <h3 className="font-display text-[15.5px]">{skill.title}</h3>
            <p className="text-sm text-muted">{skill.description}</p>
          </Card>
        ))}
      </div>

      {infraHighlights.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {infraHighlights.map((highlight) => (
            <li
              key={highlight}
              className="rounded-full border-2 border-stroke bg-panel px-3 py-1 font-mono text-[11px] tracking-[0.06em] uppercase"
            >
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
