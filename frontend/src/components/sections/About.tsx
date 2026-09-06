import type { Profile } from "../../types/content";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";

const barColors = ["bg-yellow", "bg-pink", "bg-mint", "bg-orange"];

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  // A capa já mostrou o primeiro parágrafo; aqui entra o restante. Se um dia o
  // resumo tiver só um parágrafo, repete esse mesmo em vez de ficar vazio.
  const paragraphs = profile.summary.length > 1 ? profile.summary.slice(1) : profile.summary;

  return (
    <section id="sobre" className="flex scroll-mt-24 flex-col gap-5">
      <SectionHeading title="Sobre" kicker="Quem faz" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,1fr)]">
        <Card className="flex flex-col gap-3">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-muted">
              {paragraph}
            </p>
          ))}
        </Card>

        <Card className="flex flex-col gap-4">
          <dl className="flex flex-col gap-2 font-mono text-[11.5px]">
            <div className="flex justify-between gap-3">
              <dt className="tracking-[0.06em] text-muted uppercase">Local</dt>
              <dd className="text-right">{profile.location}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="tracking-[0.06em] text-muted uppercase">Cargo</dt>
              <dd className="text-right">{profile.role}</dd>
            </div>
          </dl>

          <div className="h-0.5 rounded-sm bg-stroke" />

          <span className="w-fit rounded-full border-2 border-stroke-soft bg-mint px-2.5 py-1 font-mono text-[11px] font-bold text-on-accent">
            Perfil: {profile.profileBadge}
          </span>

          <ul className="flex flex-col gap-2.5">
            {profile.behavior.map((trait, index) => (
              <li key={trait.label} className="grid grid-cols-[88px_1fr_38px] items-center gap-2.5 text-[12.5px]">
                <span>{trait.label}</span>
                <span className="h-3 overflow-hidden rounded-full border-2 border-stroke bg-panel-2">
                  <span
                    className={`block h-full ${barColors[index % barColors.length]}`}
                    style={{ width: `${trait.percent}%` }}
                  />
                </span>
                <span className="text-right font-mono tabular-nums text-muted">{trait.percent}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
