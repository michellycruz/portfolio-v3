import { X } from "lucide-react";
import { navItems } from "../../lib/nav";
import type { Profile } from "../../types/content";
import { ThemeToggle } from "./ThemeToggle";
import { PaletteToggle } from "./PaletteToggle";

interface SidebarProps {
  profile: Profile;
  /** No desktop, sai da rolagem (passou da capa); no celular, da gaveta. */
  shown: boolean;
  /** Gaveta aberta no celular — controla só o véu escuro por cima do conteúdo. */
  open: boolean;
  onClose: () => void;
  activeId: string;
}

export function Sidebar({ profile, shown, open, onClose, activeId }: SidebarProps) {
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <>
      {/* Véu da gaveta no celular. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Navegação das seções"
        // Fora da tela o menu sai também da ordem de tabulação: sem isso o
        // teclado entraria em links invisíveis enquanto se lê a capa.
        aria-hidden={!shown}
        inert={!shown}
        className={`fixed top-0 left-0 z-50 flex h-svh w-sidebar flex-col gap-4 border-r-2 border-stroke bg-panel px-3.5 py-5 transition-transform duration-300 ease-out ${
          shown ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-1">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-stroke-soft bg-orange font-display text-[15px] tracking-[-0.02em] text-on-accent shadow-brutal-sm"
          >
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight">{profile.name}</span>
            <span className="block font-mono text-[10.5px] tracking-[0.06em] text-muted uppercase">
              {profile.role}
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="ml-auto rounded-lg border-2 border-stroke p-1.5 lg:hidden"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <nav className="mt-1.5 flex flex-col gap-1.5">
          <p className="px-2.5 pb-1 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">Seções</p>
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = id === activeId;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={onClose}
                aria-current={active ? "true" : undefined}
                className={`flex items-center gap-3 rounded-xl border-2 px-2.5 py-2.5 text-[14.5px] font-medium transition-colors duration-150 ${
                  active
                    ? "border-stroke-soft bg-orange font-bold text-on-accent shadow-brutal-sm"
                    : "border-transparent hover:bg-hover"
                }`}
              >
                <Icon className="h-[19px] w-[19px] shrink-0" strokeWidth={2} />
                {label}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2.5">
          <div className="flex items-center gap-3 rounded-xl border-2 border-stroke bg-panel-2 p-2.5">
            {/* O halo sai da própria menta da paleta, e não de um rgba fixo:
                assim ele acompanha a troca em vez de ficar no verde da v3. */}
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-mint shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-mint)_22%,transparent)]" />
            <span className="text-[12.5px] leading-tight">
              <b className="block text-[13px]">Disponível</b>
              <span className="font-mono text-[10.5px] text-muted">{profile.location}</span>
            </span>
          </div>
          <ThemeToggle withLabel className="w-full" />
          <PaletteToggle withLabel className="w-full" />
        </div>
      </aside>
    </>
  );
}
