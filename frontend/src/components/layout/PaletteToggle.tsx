import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

/** As quatro paletas em comparação. O valor vazio é a terra, que mora no :root e
 *  não precisa de atributo nenhum para valer. */
const palettes = [
  { id: "", label: "terra" },
  { id: "riso", label: "riso" },
  { id: "vitral", label: "vitral" },
  { id: "polar", label: "polar" },
] as const;

const STORAGE_KEY = "palette";

function currentIndex(): number {
  if (typeof document === "undefined") return 0;
  const active = document.documentElement.dataset.palette ?? "";
  const found = palettes.findIndex((p) => p.id === active);
  return found === -1 ? 0 : found;
}

/**
 * Alterna entre as paletas. Nasceu como ferramenta de comparação, montada só em
 * desenvolvimento, e virou parte do site: quem visita escolhe em qual das quatro
 * quer ler, do mesmo jeito que escolhe claro ou escuro. A escolha fica no
 * localStorage e o boot script em index.html a aplica antes da primeira pintura,
 * para a paleta não piscar na troca.
 */
export function PaletteToggle({ withLabel = false, className = "" }: {
  withLabel?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(currentIndex);
  const palette = palettes[index];

  useEffect(() => {
    const root = document.documentElement;
    if (palette.id) root.dataset.palette = palette.id;
    else delete root.dataset.palette;
    localStorage.setItem(STORAGE_KEY, palette.id);
  }, [palette]);

  const next = palettes[(index + 1) % palettes.length];

  return (
    <button
      type="button"
      onClick={() => setIndex((i) => (i + 1) % palettes.length)}
      aria-label={`Paleta ${palette.label}. Trocar para ${next.label}`}
      title={`Paleta: ${palette.label} (clique para ${next.label})`}
      className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border-2 border-stroke bg-panel-2 px-3 font-mono text-[11px] tracking-[0.06em] uppercase transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${className}`}
    >
      <Palette className="h-4 w-4" strokeWidth={2} />
      {withLabel && <span>Paleta: {palette.label}</span>}
    </button>
  );
}
