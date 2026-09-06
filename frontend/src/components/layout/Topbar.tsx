import { Download, Menu } from "lucide-react";

interface TopbarProps {
  /** Entra junto com o menu lateral, depois da capa. */
  visible: boolean;
  onOpenMenu: () => void;
  /** Rótulo da seção que está sendo lida. */
  crumb: string;
  resumeUrl: string;
}

export function Topbar({ visible, onOpenMenu, crumb, resumeUrl }: TopbarProps) {
  return (
    <header
      className={`fixed top-0 right-0 left-0 z-30 flex items-center gap-3.5 border-b-2 border-stroke bg-bg/85 px-4 py-2.5 backdrop-blur-md transition-all duration-300 sm:px-6 lg:pl-[calc(var(--spacing-sidebar)+1.5rem)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-stroke bg-panel-2 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={2} />
      </button>

      <p className="truncate font-mono text-[11.5px] tracking-[0.1em] text-muted uppercase">
        Portfólio / <b className="text-ink">{crumb}</b>
      </p>

      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener"
        className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-xl border-2 border-stroke-soft bg-panel-2 px-3 py-2 font-mono text-[11px] font-bold tracking-[0.08em] uppercase shadow-brutal-sm transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
      >
        <Download className="h-4 w-4" strokeWidth={2} />
        <span className="hidden sm:inline">Currículo</span>
      </a>
    </header>
  );
}
