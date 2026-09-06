import type { Institution } from "../../types/content";
import { coursesByArea } from "../../lib/courses";

/** A área em destaque; as outras ficam neutras para o olho cair aqui primeiro. */
const HIGHLIGHT = "IA e Automação";

export function FormationChart({ institutions }: { institutions: Institution[] }) {
  const rows = coursesByArea(institutions);
  if (rows.length === 0) return null;

  // As barras são medidas contra a maior área, não contra o total: isto conta
  // cursos, não reivindica participação em nada.
  const max = Math.max(...rows.map((row) => row.count));

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-display text-[15px]">Formação por área</h3>
        <p className="font-mono text-[10.5px] text-muted">Número de cursos concluídos em cada área</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {rows.map((row) => {
          const highlighted = row.area === HIGHLIGHT;
          // Abaixo de sm a barra ganha uma linha inteira: com uma coluna fixa de
          // rótulo sobrariam uns 60px para desenhar.
          return (
            <li
              key={row.area}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(0,10rem)_1fr_auto]"
            >
              <span className={`truncate text-[13px] ${highlighted ? "font-bold" : "text-muted"}`}>
                {row.area}
              </span>

              <span
                className={`shrink-0 text-right font-mono text-[10.5px] tabular-nums whitespace-nowrap sm:order-3 sm:w-20 ${
                  highlighted ? "font-bold" : "text-muted"
                }`}
              >
                {row.count} {row.count === 1 ? "curso" : "cursos"}
              </span>

              <span className="col-span-2 h-3 overflow-hidden rounded-full border-2 border-stroke bg-panel-2 sm:order-2 sm:col-span-1">
                <span
                  className={`block h-full ${highlighted ? "bg-orange" : "bg-muted"}`}
                  style={{ width: `${(row.count / max) * 100}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
