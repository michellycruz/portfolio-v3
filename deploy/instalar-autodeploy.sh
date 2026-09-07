#!/usr/bin/env bash
#
# Instalador do autodeploy do portfolio, para rodar na VPS.
#
#   sudo bash deploy/instalar-autodeploy.sh
#
# Idempotente: reescreve o script, a unit e o timer a cada execucao. Serve
# tanto para instalar do zero quanto para aplicar uma mudanca feita aqui no
# repositorio -- a copia que roda na VPS e gerada por este arquivo, nunca
# editada la.
#
# O desenho do deploy e a operacao do dia a dia estao em .github/DEPLOY.md.

set -Eeuo pipefail

REPO="${REPO:-michellycruz/portfolio-v3}"
TAG="${TAG:-deploy-latest}"
ASSET="${ASSET:-portfolio-build.tar.gz}"
APP_DIR="${APP_DIR:-/opt/portfolio}"
STATE_DIR="${STATE_DIR:-/var/lib/portfolio-autodeploy}"
SERVICE="${SERVICE:-portfolio}"
APP_USER="${APP_USER:-portfolio}"
INTERVALO="${INTERVALO:-5min}"

SCRIPT=/usr/local/bin/portfolio-autodeploy
UNIT=/etc/systemd/system/portfolio-autodeploy.service
TIMER=/etc/systemd/system/portfolio-autodeploy.timer

if [[ $EUID -ne 0 ]]; then
  echo "rode como root: sudo bash $0" >&2
  exit 1
fi

for dep in curl tar systemctl install; do
  command -v "$dep" >/dev/null || { echo "faltando: $dep" >&2; exit 1; }
done

# Avisos, nao erros: o instalador cuida so do autodeploy. O servico do
# portfolio e o /opt/portfolio/.env sao pre-requisitos instalados a mao.
id "$APP_USER" >/dev/null 2>&1 || echo "aviso: usuario '$APP_USER' nao existe"
systemctl cat "$SERVICE" >/dev/null 2>&1 || echo "aviso: servico '$SERVICE' nao existe"
[[ -f "$APP_DIR/.env" ]] || echo "aviso: $APP_DIR/.env nao existe -- o backend nao sobe sem SMTP"

# ---------------------------------------------------------------- o script --

# Cabecalho gerado: fixa a configuracao acima dentro da copia instalada, para
# que o corpo abaixo possa ir literal (heredoc com aspas, sem expansao).
cat > "$SCRIPT" <<EOF
#!/usr/bin/env bash
#
# GERADO POR deploy/instalar-autodeploy.sh -- edite no repositorio e reinstale,
# nao edite este arquivo.

set -Eeuo pipefail

REPO="$REPO"
TAG="$TAG"
ASSET="$ASSET"
APP_DIR="$APP_DIR"
STATE_DIR="$STATE_DIR"
SERVICE="$SERVICE"
APP_USER="$APP_USER"
EOF

cat >> "$SCRIPT" <<'EOF'

log()  { echo "[autodeploy] $*"; }
erro() { echo "[autodeploy] ERRO: $*" >&2; }

# ---- ha algo novo? -----------------------------------------------------------

# O corpo da release guarda o SHA do commit. Ele so entra la depois que o build
# passou, entao nunca apontamos para um pacote que ainda estava compilando.
api="https://api.github.com/repos/$REPO/releases/tags/$TAG"
json=$(curl -fsSL --max-time 30 "$api") || { erro "nao consegui consultar $api"; exit 1; }

# Parse sem jq, para nao exigir a dependencia na VPS. O padrao so casa com 40
# hex, e o resultado e validado logo abaixo: se o parse quebrar o script para,
# em vez de instalar lixo.
remoto=$(printf '%s' "$json" | tr ',' '\n' \
  | sed -n 's/.*"body"[[:space:]]*:[[:space:]]*"\([0-9a-f]\{40\}\).*/\1/p' | head -n1)

if [[ ! "$remoto" =~ ^[0-9a-f]{40}$ ]]; then
  erro "nao achei um SHA no corpo da release $TAG"
  exit 1
fi

atual=nenhum
if [[ -s "$STATE_DIR/deployed-sha" ]]; then
  atual=$(tr -d '[:space:]' < "$STATE_DIR/deployed-sha")
fi

if [[ "$remoto" == "$atual" ]]; then
  log "ja esta em ${remoto:0:7}, nada a fazer"
  exit 0
fi

log "atualizando de ${atual:0:7} para ${remoto:0:7}"

# ---- baixa e confere ---------------------------------------------------------

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

url="https://github.com/$REPO/releases/download/$TAG/$ASSET"
curl -fsSL --max-time 300 -o "$tmp/pacote.tar.gz" "$url" \
  || { erro "download falhou: $url"; exit 1; }

mkdir -p "$tmp/novo"
tar -xzf "$tmp/pacote.tar.gz" -C "$tmp/novo" || { erro "pacote corrompido"; exit 1; }

# So mexe em producao depois de validar o pacote: um download truncado nao pode
# derrubar o site.
[[ -s "$tmp/novo/portfolio" ]]       || { erro "binario ausente no pacote"; exit 1; }
[[ -s "$tmp/novo/dist/index.html" ]] || { erro "dist/index.html ausente no pacote"; exit 1; }

# O workflow sobe o asset antes de gravar o SHA nas notas, entao o normal e o
# pacote ja ser o do commit anunciado. Se por algum motivo nao for, parar aqui
# custa cinco minutos; instalar assim mesmo grava um deployed-sha mentiroso e o
# site fica travado numa versao antiga que se diz atual.
if [[ -f "$tmp/novo/COMMIT" ]]; then
  empacotado=$(tr -d '[:space:]' < "$tmp/novo/COMMIT")
  if [[ "$empacotado" != "$remoto" ]]; then
    erro "pacote e do commit $empacotado, mas a release anuncia $remoto"
    exit 1
  fi
fi

chmod 755 "$tmp/novo/portfolio"

# ---- troca -------------------------------------------------------------------

# O .env fica fora dessa troca: mora em $APP_DIR, nao vem no pacote e nunca e
# apagado. Sem ele o checkMailConfig em main.go derruba o backend de proposito
# -- e o comportamento correto, mas o deploy nao pode ser quem provoca.
log "parando $SERVICE"
systemctl stop "$SERVICE" || true

if [[ -e "$APP_DIR/portfolio" ]]; then
  cp -a "$APP_DIR/portfolio" "$APP_DIR/portfolio.prev"
fi
if [[ -d "$APP_DIR/dist" ]]; then
  rm -rf "$APP_DIR/dist.prev"
  cp -a "$APP_DIR/dist" "$APP_DIR/dist.prev"
fi

cp -a "$tmp/novo/portfolio" "$APP_DIR/portfolio"
rm -rf "$APP_DIR/dist"
cp -a "$tmp/novo/dist" "$APP_DIR/dist"
chown -R "$APP_USER:$APP_USER" "$APP_DIR/portfolio" "$APP_DIR/dist"

log "subindo $SERVICE"
systemctl start "$SERVICE" || true
sleep 3

if systemctl is-active --quiet "$SERVICE"; then
  echo "$remoto" > "$STATE_DIR/deployed-sha"
  log "no ar em ${remoto:0:7}"
  exit 0
fi

# ---- rollback ----------------------------------------------------------------

# deployed-sha nao e gravado aqui de proposito: o proximo ciclo tenta de novo,
# e o commit quebrado fica reclamando no journal a cada intervalo ate alguem
# empurrar a correcao.
erro "$SERVICE nao subiu -- restaurando a versao anterior"

if [[ -e "$APP_DIR/portfolio.prev" ]]; then
  cp -a "$APP_DIR/portfolio.prev" "$APP_DIR/portfolio"
fi
if [[ -d "$APP_DIR/dist.prev" ]]; then
  rm -rf "$APP_DIR/dist"
  cp -a "$APP_DIR/dist.prev" "$APP_DIR/dist"
fi
chown -R "$APP_USER:$APP_USER" "$APP_DIR/portfolio" "$APP_DIR/dist" || true

systemctl start "$SERVICE" || true
journalctl -u "$SERVICE" -n 20 --no-pager >&2 || true
exit 1
EOF

chmod 755 "$SCRIPT"

# ------------------------------------------------------------- unit e timer --

cat > "$UNIT" <<EOF
[Unit]
Description=Atualiza o portfolio a partir da release $TAG
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=$SCRIPT
EOF

cat > "$TIMER" <<EOF
[Unit]
Description=Consulta a release $TAG a cada $INTERVALO

[Timer]
OnBootSec=2min
OnUnitActiveSec=$INTERVALO
AccuracySec=30s
Unit=portfolio-autodeploy.service

[Install]
WantedBy=timers.target
EOF

install -d -m 755 "$STATE_DIR"
install -d -m 755 "$APP_DIR"

systemctl daemon-reload
systemctl enable --now portfolio-autodeploy.timer

echo
echo "instalado:"
echo "  $SCRIPT"
echo "  $UNIT"
echo "  $TIMER"
echo "  $STATE_DIR/deployed-sha  (SHA instalado)"
echo
echo "checar agora:  sudo systemctl start portfolio-autodeploy.service"
echo "acompanhar:    journalctl -u portfolio-autodeploy -n 40 --no-pager"
