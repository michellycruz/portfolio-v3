/**
 * A foto da capa em três larguras. A original tem 880px, e no quadro ela ocupa
 * no máximo 460px no desktop e 340px no celular: sem as menores, quem vê numa
 * tela comum baixava mais que o dobro do que a tela mostra.
 *
 * As variantes moram ao lado da original, com a largura no nome
 * (`foto-pessoal-480.webp`). O index.html pré-carrega o mesmo conjunto, e um
 * teste do backend confere que os dois batem e que os arquivos existem.
 */
export const LARGURA_DA_ORIGINAL = 880;
export const LARGURAS_MENORES = [480, 640];

/** O quanto a foto ocupa na tela; o grid da capa não passa disso. */
export const TAMANHOS_DA_FOTO = "(min-width: 1024px) 460px, 340px";

export function srcsetDaFoto(url: string): string {
  const ponto = url.lastIndexOf(".");
  const menores = LARGURAS_MENORES.map((largura) => `${url.slice(0, ponto)}-${largura}${url.slice(ponto)} ${largura}w`);
  return [...menores, `${url} ${LARGURA_DA_ORIGINAL}w`].join(", ");
}
