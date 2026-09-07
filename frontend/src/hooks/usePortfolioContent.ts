import type { Content } from "../types/content";
import { fallbackContent } from "../data/fallback-content";

/**
 * Esta versão é servida como site estático, sem o backend ao lado, então o
 * conteúdo vem direto do arquivo local — que sempre foi completo, porque existia
 * como reserva para quando a API não respondesse.
 *
 * Antes daqui saía um fetch em /api/content que, sem servidor, falhava sempre:
 * acendia a tarja de erro no topo em toda visita e deixava uma requisição
 * vermelha no console de quem abrisse o inspetor. Sem API para consultar, não há
 * o que esperar nem o que falhar.
 */
export function usePortfolioContent(): { content: Content } {
  return { content: fallbackContent };
}
