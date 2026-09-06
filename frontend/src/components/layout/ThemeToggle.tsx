import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ThemeToggleProps {
  /** Mostra o rótulo ao lado do ícone (usado no rodapé do menu lateral). */
  withLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ withLabel = false, className = "" }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      title="Alternar tema"
      className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border-2 border-stroke bg-panel-2 px-3 font-mono text-[11px] tracking-[0.06em] uppercase transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
      {withLabel && <span>Tema</span>}
    </button>
  );
}
