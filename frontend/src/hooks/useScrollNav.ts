import { useEffect, useState } from "react";

/**
 * Diz se a página inicial já saiu de vista. É o gatilho do menu lateral: ele só
 * aparece depois que a pessoa desce da capa.
 *
 * Usa IntersectionObserver no próprio elemento da capa em vez de um limite fixo
 * de scrollY, porque a altura da capa muda com a tela (e com a barra do
 * navegador no celular).
 */
export function useScrolledPast(ref: React.RefObject<HTMLElement | null>): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting),
      // Só considera passada quando resta menos de um quinto da capa na tela.
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return past;
}

/**
 * Devolve o id da seção que está sendo lida, para destacar o item do menu.
 *
 * A margem inferior de -60% faz a troca acontecer quando a seção chega ao terço
 * de cima da tela, e não quando encosta na borda de baixo — assim o destaque
 * acompanha o que a pessoa está lendo, não o que acabou de entrar.
 */
export function useActiveSection(ids: string[], enabled: boolean): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!enabled) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-88px 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}

/**
 * Acompanha uma media query. Serve para o App saber se o menu lateral está no
 * modo fixo (desktop) ou de gaveta (celular) — os dois têm gatilhos diferentes,
 * e sem essa distinção o menu fora da tela continuaria recebendo o foco do
 * teclado.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);

    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
