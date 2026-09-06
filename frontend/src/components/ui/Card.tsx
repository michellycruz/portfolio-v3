import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Levanta o cartão no hover, para os que são clicáveis (projetos, links). */
  interactive?: boolean;
}

export function Card({ children, className = "", interactive = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-stroke bg-panel p-6 shadow-brutal ${
        interactive
          ? "transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
