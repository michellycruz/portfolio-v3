#!/usr/bin/env bash
# Imprime resume/curriculo.html no PDF que o site entrega.
#
# O PDF anterior tinha sido impresso a mão pelo Chrome e a fonte HTML se perdeu,
# o que obrigou a refazer o currículo do zero. Este script existe para isso não
# se repetir: a fonte é versionada e o PDF sai dela.
#
#   bash resume/gerar-pdf.sh
set -euo pipefail

raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fonte="$raiz/resume/curriculo.html"
saida="$raiz/frontend/public/resume/curriculo_michelly.pdf"

# Windows, WSL e Linux guardam o Chrome em lugares diferentes.
for candidato in \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  "$HOME/AppData/Local/Google/Chrome/Application/chrome.exe" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)"; do
  if [ -n "$candidato" ] && [ -x "$candidato" ]; then
    chrome="$candidato"
    break
  fi
done

if [ -z "${chrome:-}" ]; then
  echo "Chrome não encontrado. Instale o Chrome ou ajuste o caminho neste script." >&2
  exit 1
fi

# O Chrome sai com código 0 mesmo quando não consegue gravar o PDF (com o
# arquivo aberto num leitor que o trava, por exemplo). Apagar antes e conferir
# depois é o que garante que o PDF no disco é o novo, antes de o link do site
# passar a apontar para ele. Se o arquivo estiver travado, o rm já falha aqui.
rm -f "$saida"

# --no-pdf-header-footer tira a data e a URL que o Chrome carimba por padrão nas
# margens: num currículo elas viram lixo no texto que o ATS extrai.
"$chrome" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$(cygpath -w "$saida" 2>/dev/null || echo "$saida")" \
  "file://$(cygpath -w "$fonte" 2>/dev/null || echo "$fonte")"

if [ ! -s "$saida" ]; then
  echo "O Chrome não gravou $saida; o portfolio.json não foi alterado." >&2
  exit 1
fi
echo "PDF gerado em $saida"

# O Cloudflare guarda o PDF por 4 horas na borda, e a URL nunca mudava: um
# currículo novo levava horas para chegar a quem clicava no site. O link do site
# passa a levar um ?v= com o hash da fonte, então cada versão tem URL própria.
# O arquivo continua no mesmo caminho, e links antigos, de fora do site, seguem
# funcionando. O hash é o do git, que não muda com o CRLF da cópia no Windows.
conteudo="$raiz/backend/internal/content/portfolio.json"
versao="$(git -C "$raiz" hash-object resume/curriculo.html | cut -c1-8)"
sed -i -E "s|(\"resumeUrl\": \"/resume/curriculo_michelly\.pdf)[^\"]*\"|\1?v=$versao\"|" "$conteudo"
if ! grep -q "curriculo_michelly.pdf?v=$versao\"" "$conteudo"; then
  echo "Não achei o resumeUrl em $conteudo para atualizar o ?v=." >&2
  exit 1
fi
echo "Link do site atualizado: /resume/curriculo_michelly.pdf?v=$versao"
