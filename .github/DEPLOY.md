# Deploy automático

A cada push no `master`, o [workflow](workflows/deploy.yml) roda os testes do
backend, builda e publica o resultado na release **`deploy-latest`**. Um timer
na VPS consulta essa release a cada 5 minutos e se atualiza quando o commit
muda. Se um teste falha, não sai release e o site fica na versão anterior.

```
push no master
      │
      ▼
GitHub Actions ── builda frontend + backend ──▶ release "deploy-latest"
                                                  (portfolio-build.tar.gz)
                                                        │
                                        a VPS consulta a cada 5 min
                                                        │
                                                        ▼
                                          troca binário + dist, reinicia
```

## Por que a VPS puxa em vez de receber

A primeira versão entrava por SSH a partir do runner. Não funciona aqui: o
firewall da VPS só libera IPs conhecidos, e a porta 22 não responde em 20
segundos a partir do GitHub, embora responda do IP de casa. Liberar as faixas
do Actions significaria abrir o SSH para boa parte da Azure — desproporcional
para um deploy.

Invertendo o sentido: **nenhuma porta é aberta, nenhuma chave fica no GitHub**,
e o processo roda local com o dono correto dos arquivos.

## Como a VPS decide que há algo novo

O corpo da release guarda o SHA do commit. A VPS compara com
`/var/lib/portfolio-autodeploy/deployed-sha` e só age se forem diferentes.

O SHA só entra na release **depois** que o build passou, então a VPS nunca
baixa um pacote de um commit que ainda estava compilando.

## O que está instalado na VPS

| Caminho | Papel |
| --- | --- |
| `/usr/local/bin/portfolio-autodeploy` | script que consulta, baixa e instala |
| `/etc/systemd/system/portfolio-autodeploy.service` | unit `oneshot` |
| `/etc/systemd/system/portfolio-autodeploy.timer` | dispara a cada 5 min |
| `/var/lib/portfolio-autodeploy/deployed-sha` | SHA já instalado |
| `/opt/portfolio` | app: `portfolio`, `dist/`, `.env` |

### Proteções

- **O `.env` nunca é tocado.** Fica fora do git e guarda o SMTP. Sem ele o
  `checkMailConfig` em `main.go` derruba o servidor de propósito — é o
  comportamento correto, mas o deploy não pode provocá-lo.
- **Só mexe em produção depois de validar o pacote** (binário e `dist/index.html`
  presentes, e o `COMMIT` de dentro do pacote batendo com o SHA anunciado na
  release). Download truncado não derruba o site.
- **Rollback automático:** se o serviço não subir, o script restaura
  `portfolio.prev` e `dist.prev`, reinicia e sai com erro. O `deployed-sha`
  não é gravado nesse caso, então o ciclo seguinte tenta o mesmo commit de
  novo — um commit quebrado reclama no journal a cada intervalo até a correção
  subir, em vez de falhar uma vez e silenciar.
- **`VITE_API_URL` vai vazia** no build. Indefinida, `lib/api.ts` cai no default
  `http://localhost:8080` e o site publicado chamaria a máquina do visitante.

## Operação

```bash
# forçar agora, sem esperar o ciclo
sudo systemctl start portfolio-autodeploy.service

# acompanhar
journalctl -u portfolio-autodeploy -n 40 --no-pager
systemctl list-timers portfolio-autodeploy.timer

# qual versão está instalada
cat /var/lib/portfolio-autodeploy/deployed-sha

# rollback manual
cd /opt/portfolio
sudo systemctl stop portfolio
sudo cp -a portfolio.prev portfolio && sudo rm -rf dist && sudo cp -a dist.prev dist
sudo chown -R portfolio:portfolio portfolio dist && sudo systemctl start portfolio
```

Para mudar o intervalo, edite `OnUnitActiveSec` no `.timer` e rode
`sudo systemctl daemon-reload && sudo systemctl restart portfolio-autodeploy.timer`.

## Reinstalar do zero

O instalador vive no repositório, em
[`deploy/instalar-autodeploy.sh`](../deploy/instalar-autodeploy.sh). As três
primeiras linhas da tabela acima são **geradas por ele** — a cópia em
`/usr/local/bin` traz um aviso no cabeçalho dizendo isso. Para mudar o
comportamento do deploy, edite o arquivo aqui e reinstale; editar direto na VPS
perde a mudança na próxima execução.

É idempotente, então a mesma linha instala do zero e atualiza:

```bash
# na VPS
git clone https://github.com/michellycruz/portfolio-v3 ~/portfolio-v3   # ou: cd ~/portfolio-v3 && git pull
sudo bash ~/portfolio-v3/deploy/instalar-autodeploy.sh
```

Os padrões saem por variável de ambiente, sem editar o script —
`INTERVALO=2min`, `APP_DIR=`, `SERVICE=`, `APP_USER=`, `REPO=`.

### Se o repositório for renomeado

O nome fica gravado em `/usr/local/bin/portfolio-autodeploy`, na linha `REPO=`, e
as URLs da API do GitHub são montadas a partir dele. O script usa `curl -fsSL`,
que **segue redirecionamento**, então logo após um rename ele continua
funcionando — o GitHub redireciona o nome antigo para o novo.

Mas esse redirecionamento não é para sempre: ele deixa de existir no momento em
que alguém cria um repositório novo com o nome antigo. Como o nome antigo aqui é
justamente `portfolio-v2`, e a versão anterior do portfólio é candidata natural a
ganhar um repositório próprio um dia, não vale depender dele.

Depois de renomear, atualize a linha na VPS:

```bash
sudo sed -i 's|^REPO=.*|REPO="${REPO:-michellycruz/portfolio-v3}"|' /usr/local/bin/portfolio-autodeploy
sudo systemctl start portfolio-autodeploy.service   # força um ciclo agora
journalctl -u portfolio-autodeploy.service -n 30 --no-pager
```

Ou, mais simples, rode o instalador de novo a partir do clone atualizado: ele
reescreve o script inteiro com o padrão novo.

O instalador cuida **só** do autodeploy. O serviço `portfolio` em si, o usuário
`portfolio` e o `/opt/portfolio/.env` são pré-requisitos instalados à mão; se
faltar algum, ele avisa e segue.

## Secrets

**Nenhum é necessário.** O workflow usa apenas o `GITHUB_TOKEN` automático
(com `contents: write`, para publicar a release).

Os secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` e as variables `DEPLOY_PATH` e
`SERVICE_NAME`, que sobraram da tentativa por SSH, foram apagados em 10/09/2026.
A chave pública que correspondia ao `VPS_SSH_KEY` deve sair também do
`~/.ssh/authorized_keys` na VPS; isso é feito à mão, pela SSH de casa.

A `master` tem um ruleset ("Protege a master") que bloqueia force-push e
exclusão da branch. Push normal continua funcionando.
