import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

/* O contexto e o hook moram fora do arquivo do componente porque o Fast
   Refresh só recarrega um módulo em que tudo o que sai é componente: com o
   hook junto, cada troca de tema durante o desenvolvimento remontava a
   árvore inteira. */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme precisa estar dentro do ThemeProvider");
  return ctx;
}
