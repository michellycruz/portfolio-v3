import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Course, Institution } from "../../types/content";
import { courseCounts, isDone, isPlannedTrack } from "../../lib/courses";

function CourseRow({ course }: { course: Course }) {
  const inProgress = course.status === "cursando";
  // Curso em andamento ainda não tem data de conclusão nem carga certificada.
  const note = inProgress ? "cursando" : [course.date, course.hours].filter(Boolean).join(" · ");

  // Abaixo de sm o título e a data empilham: lado a lado o título fica com uns
  // 130px e quebra em quatro linhas, e a data escapa pela direita.
  return (
    <li className="py-1 text-sm sm:flex sm:items-baseline sm:gap-2">
      <span className="flex min-w-0 items-baseline gap-2">
        {/* O marcador mostra a situação de relance: cheio para curso concluído,
            vazado em laranja para o que está em curso e vazado neutro para
            matéria só prevista. */}
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-[2px] ${
            isDone(course) ? "bg-orange" : inProgress ? "border-2 border-orange" : "border-2 border-muted"
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
  // Cursos feitos, matérias em curso e matérias só previstas não somam no mesmo
  // número. Quem tem curso feito conta os cursos, e o resto aparece ao abrir;
  // uma pós recém-matriculada conta o que está em curso ou, antes da primeira
  // aula, as matérias previstas.
  const { studied, inProgress, planned } = courseCounts(institution);
  const summary =
    studied > 0
      ? `${studied} ${studied === 1 ? "curso" : "cursos"}`
      : inProgress > 0
        ? `${inProgress} ${inProgress === 1 ? "matéria em curso" : "matérias em curso"}`
        : `${planned} ${planned === 1 ? "matéria prevista" : "matérias previstas"}`;

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
          {summary}
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
                      isPlannedTrack(track)
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
                    <CourseRow key={course.title} course={course} />
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
