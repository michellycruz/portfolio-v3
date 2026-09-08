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

# --no-pdf-header-footer tira a data e a URL que o Chrome carimba por padrão nas
# margens: num currículo elas viram lixo no texto que o ATS extrai.
"$chrome" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$(cygpath -w "$saida" 2>/dev/null || echo "$saida")" \
  "file://$(cygpath -w "$fonte" 2>/dev/null || echo "$fonte")"

echo "PDF gerado em $saida"
