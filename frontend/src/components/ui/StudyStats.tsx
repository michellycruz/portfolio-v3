import type { Institution } from "../../types/content";
import { studyTotals } from "../../lib/courses";

interface StudyStatsProps {
  institutions: Institution[];
}

/** Tamanho do esforço de estudo antes de abrir qualquer instituição. */
export function StudyStats({ institutions }: StudyStatsProps) {
  const { courses, hours, missingHours } = studyTotals(institutions);
  if (courses === 0) return null;

  const stats = [
    { label: "Cursos concluídos", value: courses.toLocaleString("pt-BR"), accent: "bg-mint" },
    { label: "Horas de estudo", value: `${hours.toLocaleString("pt-BR")}h`, accent: "bg-yellow" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border-2 border-stroke bg-panel-2 px-4 py-3"
          >
            <span aria-hidden="true" className={`h-9 w-1.5 shrink-0 rounded-full ${stat.accent}`} />
            <span>
              <span className="block font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">
                {stat.label}
              </span>
              <span className="block font-display text-2xl leading-tight">{stat.value}</span>
            </span>
          </div>
        ))}
      </div>

      {missingHours > 0 && (
        <p className="font-mono text-[10.5px] text-muted">
          {missingHours === 1
            ? "1 curso sem carga horária declarada não entra no total de horas."
            : `${missingHours} cursos sem carga horária declarada não entram no total de horas.`}
        </p>
      )}
    </div>
  );
}
