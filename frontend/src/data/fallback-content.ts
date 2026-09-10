import type { Content } from "../types/content";
import portfolio from "../../../backend/internal/content/portfolio.json";

// O conteúdo mora num arquivo só, backend/internal/content/portfolio.json: o Go
// o embute no binário e este módulo importa o mesmo arquivo. É o que a página
// mostra enquanto a API responde e o que fica se ela cair, sem uma segunda cópia
// para divergir. A anotação de tipo faz o `tsc -b` do build recusar o arquivo
// fora do formato, como uma carga escrita como número ou um curso sem área.
export const fallbackContent: Content = portfolio;
