import { useEffect, useRef, useState } from "react";
import { Flame, Lightbulb } from "lucide-react";

/** Cada "pixel" da escuridão tem este tamanho na tela. */
const CELL = 8;
/** Raio da luz da tocha, em pixels da tela. */
const RADIUS = 160;

/**
 * Botão que apaga as luzes do site: a página fica escura, o cursor vira uma
 * tocha em pixel art e só o que está perto dela aparece. A escuridão é um canvas
 * de baixa resolução esticado sem suavizar, então a borda da luz sai em degraus
 * (com um xadrez entre as faixas), como num jogo antigo.
 *
 * O canvas não recebe cliques: o site continua funcionando por baixo. Esc ou o
 * mesmo botão acendem a luz de novo.
 */
export function TorchMode() {
  const [on, setOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // A classe no <html> troca o cursor em todo o site (ver index.css).
  useEffect(() => {
    document.documentElement.classList.toggle("modo-tocha", on);
    return () => document.documentElement.classList.remove("modo-tocha");
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let cols = 0;
    let rows = 0;
    let image: ImageData | null = null;
    let dirty = true;
    let frame = 0;

    const resize = () => {
      cols = Math.ceil(window.innerWidth / CELL);
      rows = Math.ceil(window.innerHeight / CELL);
      canvas.width = cols;
      canvas.height = rows;
      image = ctx.createImageData(cols, rows);
      dirty = true;
    };

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      // Com movimento reduzido a luz não pisca: só redesenha quando algo muda.
      if (reduceMotion && !dirty) return;
      dirty = false;
      if (!image) return;

      const flicker = reduceMotion ? 0 : Math.sin(time / 130) * 4 + Math.sin(time / 57) * 2;
      const radius = (RADIUS + flicker) / CELL;
      const cx = pos.x / CELL;
      const cy = pos.y / CELL;
      const data = image.data;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const distance = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / radius;
          // O xadrez mistura duas faixas vizinhas na transição.
          const t = distance + ((x + y) & 1 ? 0.04 : -0.04);
          const alpha = t < 0.55 ? 0 : t < 0.75 ? 0.4 : t < 0.9 ? 0.7 : t < 1.05 ? 0.9 : 0.96;
          const i = (y * cols + x) * 4;
          data[i] = 6;
          data[i + 1] = 5;
          data[i + 2] = 10;
          data[i + 3] = alpha * 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      dirty = true;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOn(false);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", move);
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", escape);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", escape);
    };
  }, [on]);

  return (
    <>
      {on && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
          style={{ imageRendering: "pixelated" }}
        />
      )}
      <button
        type="button"
        onClick={() => setOn((value) => !value)}
        aria-pressed={on}
        className="fixed right-4 bottom-4 z-[90] inline-flex items-center gap-2 rounded-xl border-2 border-stroke-soft bg-panel-2 px-3 py-2 font-mono text-[11px] font-bold tracking-[0.08em] uppercase shadow-brutal-sm transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
      >
        {on ? <Lightbulb className="h-4 w-4" strokeWidth={2} /> : <Flame className="h-4 w-4" strokeWidth={2} />}
        {on ? "Acender a luz" : "Apagar a luz"}
      </button>
    </>
  );
}
