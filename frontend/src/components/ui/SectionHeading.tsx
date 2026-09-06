interface SectionHeadingProps {
  title: string;
  /** Etiqueta curta à direita do título — contagem, recorte, período. */
  kicker?: string;
}

export function SectionHeading({ title, kicker }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline gap-3.5">
        <h2 className="text-[clamp(26px,3.4vw,36px)]">{title}</h2>
        {kicker && (
          <span className="rounded-full border-2 border-stroke-soft bg-yellow px-2.5 py-0.5 font-mono text-[11px] tracking-[0.16em] text-on-accent uppercase">
            {kicker}
          </span>
        )}
      </div>
      <div className="h-0.5 rounded-sm bg-stroke" />
    </div>
  );
}
