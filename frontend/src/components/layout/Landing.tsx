import { forwardRef } from "react";
import { ArrowDown } from "lucide-react";
import type { Profile } from "../../types/content";
import { Button } from "../ui/Button";
import { SocialIcon } from "../ui/SocialIcon";
import { ThemeToggle } from "./ThemeToggle";
import { PaletteToggle } from "./PaletteToggle";

interface LandingProps {
  profile: Profile;
}

/**
 * Capa: ocupa a tela inteira e carrega só a foto e o resumo profissional. O
 * menu lateral não existe aqui de propósito — ele só entra quando a pessoa
 * desce daqui (ver useScrolledPast no App).
 */
export const Landing = forwardRef<HTMLElement, LandingProps>(function Landing({ profile }, ref) {
  // Só o primeiro parágrafo fica na capa; o resto do resumo abre a seção
  // "Sobre", para o mesmo texto não aparecer duas vezes na mesma rolagem.
  const [firstParagraph] = profile.summary;

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-svh flex-col justify-center px-6 py-20 sm:px-10 lg:px-16"
    >
      <div className="absolute top-6 right-6 flex items-center gap-2 sm:right-10">
        {/* Só em desenvolvimento: o menu lateral ainda não existe na capa, então
            o seletor de paleta precisa de um lugar aqui também. */}
        {import.meta.env.DEV && <PaletteToggle />}
        <ThemeToggle />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-stroke bg-panel-2 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase">
            <span className="h-2 w-2 rounded-full bg-mint" />
            {profile.role} · {profile.location}
          </span>

          <h1 className="text-[clamp(38px,7vw,72px)] leading-[0.95] tracking-[-0.03em] uppercase">
            {profile.name.split(" ")[0]}
            <br />
            <span className="text-orange">{profile.name.split(" ").slice(1).join(" ")}</span>
          </h1>

          <p className="max-w-[62ch] text-muted">{firstParagraph}</p>

          <div className="flex flex-wrap gap-3">
            <Button href="#sobre" variant="primary">
              Ver portfólio
            </Button>
            <Button href={profile.resumeUrl} target="_blank" rel="noopener">
              Currículo
            </Button>
          </div>

          <ul className="flex flex-wrap gap-3 pt-1">
            {profile.social.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={link.name}
                  title={link.name}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-stroke bg-panel-2 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm"
                >
                  <SocialIcon name={link.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* A moldura é dois blocos deslocados: o de trás é o acento colorido, o
            da frente segura a foto. É o mesmo truque das sombras duras do resto
            do site, só que em cor cheia. */}
        <div className="relative mx-auto w-full max-w-[340px] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-stroke bg-orange"
          />
          <div className="relative overflow-hidden rounded-2xl border-2 border-stroke bg-panel-2">
            <img
              src={profile.photoUrl}
              alt={`Foto de ${profile.name}`}
              width={640}
              height={800}
              // A foto é 9:16 e o quadro é 4:5, então sobra altura para cortar.
              // O ponto de corte fica abaixo do centro para tirar o teto e a
              // tomada do alto do original sem cortar o queixo.
              className="aspect-[4/5] w-full object-cover object-[50%_62%]"
            />
          </div>
        </div>
      </div>

      <a
        href="#sobre"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase"
      >
        Role para ver mais
        <ArrowDown className="animate-nudge h-4 w-4" strokeWidth={2} />
      </a>
    </section>
  );
});
