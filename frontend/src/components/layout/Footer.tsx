interface FooterProps {
  name: string;
}

export function Footer({ name }: FooterProps) {
  return (
    <footer className="flex flex-wrap justify-between gap-3 border-t-2 border-stroke pt-5 font-mono text-[11px] tracking-[0.05em] text-muted">
      <span>{name} · Portfólio</span>
      <span>&copy; {new Date().getFullYear()} — feito com React, TypeScript e Go</span>
    </footer>
  );
}
