import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Course, Institution } from "../../types/content";
import { courseCounts } from "../../lib/courses";

function CourseRow({ course, planned }: { course: Course; planned?: boolean }) {
  const note = [course.date, course.hours].filter(Boolean).join(" · ");

  // Abaixo de sm o título e a data empilham: lado a lado o título fica com uns
  // 130px e quebra em quatro linhas, e a data escapa pela direita.
  return (
    <li className="py-1 text-sm sm:flex sm:items-baseline sm:gap-2">
      <span className="flex min-w-0 items-baseline gap-2">
        {/* Matéria ainda não cursada fica com o marcador vazado: dá para ver de
            relance o que é grade prevista e o que é curso já feito. */}
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-[2px] ${
            planned ? "border-2 border-muted" : "bg-orange"
          }`}
        />
        <span className="text-muted">{course.title}</span>
      </span>
      {note && (
        <span className="ml-3.5 block shrink-0 font-mono text-[10.5px] whitespace-nowrap text-muted sm:ml-auto sm:pl-3">
          {note}
        </span>
      )}
    </li>
  );
}

function InstitutionRow({ institution }: { institution: Institution }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  // Cursos feitos e matérias só previstas não somam no mesmo número. Quem só
  // tem grade prevista (uma pós recém-matriculada) conta as matérias; o resto
  // conta cursos, e as previstas aparecem ao abrir.
  const { studied, planned } = courseCounts(institution);
  const total = studied > 0 ? studied : planned;
  const noun = studied > 0 ? (total === 1 ? "curso" : "cursos") : total === 1 ? "matéria prevista" : "matérias previstas";

  return (
    <div className="border-b-2 border-dashed border-stroke-soft last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 py-3 text-left"
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-orange transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span className="font-display text-[15px]">{institution.name}</span>
        <span className="ml-auto shrink-0 font-mono text-[10.5px] tracking-[0.06em] text-muted uppercase">
          {total} {noun}
        </span>
      </button>

      {/* A abertura anima com grid-template-rows em vez de altura fixa: assim a
          lista cresce sozinha, sem ninguém precisar medir a altura antes. */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-3 pl-4 sm:pl-7">
            {institution.tracks?.map((track) => (
              <div key={track.name} className="mb-3 last:mb-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h4 className="font-display text-sm">{track.name}</h4>
                  <span
                    className={`shrink-0 rounded-full border-2 border-stroke-soft px-2 py-0.5 font-mono text-[10px] whitespace-nowrap ${
                      track.planned
                        ? "bg-panel-2 text-muted"
                        : track.status === "Concluída"
                          ? "bg-mint text-on-accent"
                          : "bg-yellow text-on-accent"
                    }`}
                  >
                    {track.status}
                  </span>
                </div>
                <ul className="mt-1">
                  {track.courses.map((course) => (
                    <CourseRow key={course.title} course={course} planned={track.planned} />
                  ))}
                </ul>
              </div>
            ))}

            {institution.courses && institution.courses.length > 0 && (
              <ul>
                {institution.courses.map((course) => (
                  <CourseRow key={course.title} course={course} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstitutionAccordion({ institutions }: { institutions: Institution[] }) {
  return (
    <div>
      {institutions.map((institution) => (
        <InstitutionRow key={institution.name} institution={institution} />
      ))}
    </div>
  );
}
