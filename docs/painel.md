# Painel de estudos

> Ideia, ainda sem código. Escrita em 10/09/2026, a partir de uma análise do
> repositório: quatro arquiteturas desenhadas de forma independente e avaliadas
> por segurança, manutenção e fidelidade ao propósito. Os números e os
> problemas citados foram conferidos no código e no site no ar. No mesmo dia
> entraram as primeiras decisões, reunidas logo abaixo.

## A ideia

Um painel só meu, com duas funções:

1. **Organizar os estudos em andamento** — cursos livres, formações, a pós. O
   que estou fazendo, em que ponto parei, o que tem prazo, o que está parado.
2. **Atualizar o portfólio a partir dele**, sem editar código.

## Decisões

Tomadas em 10/09/2026.

1. **Só no computador, por enquanto.** O painel roda no notebook e não tem
   login próprio. O acesso pelo celular fica para uma atualização futura, a
   Fase 2.
2. **É ferramenta e projeto de portfólio.** Eu construo o painel, então o
   Notion como organizador sai. Ele só entra no portfólio depois de concluído,
   pelo critério descrito em "Quando o painel entra no portfólio".
3. **As 400h da pós viram "400h previstas"**, em visual neutro e fora de
   qualquer total, até o certificado sair.

## Por que agora

- A pós em IA começa este mês e se soma a outras quatro frentes abertas: as
  formações IA Generativa, React e DevOps da DIO e o PHP Moderno do Curso em
  Vídeo. Nada disso tem lugar hoje. O site só guarda o que terminou, e o que
  está em andamento fica na cabeça ou espalhado pelas plataformas.
- Atualizar o portfólio é editar o mesmo conteúdo em três lugares, à mão:
  `backend/internal/content/data.go`, o espelho em
  `frontend/src/data/fallback-content.ts` e `resume/curriculo.html` (e regerar o
  PDF). As três cópias já divergem:
  - o nome da Multivix tem vírgula no `data.go` e não tem no fallback;
  - o currículo lista as formações DevOps, IA Generativa e React sem "em
    andamento" — quem lê o PDF entende que foram concluídas;
  - o currículo aponta o Portfólio v2 para `michellycruz.com.br`, com deploy na
    VPS; o site diz `v2.michellycruz.com.br`, estático.

## São duas coisas diferentes

|                 | Organizar                                             | Publicar                                          |
| --------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Frequência      | toda semana, às vezes todo dia                        | quando algo termina                               |
| Quem vê         | só eu                                                 | qualquer visitante                                |
| O que muda      | status, progresso, próximo passo, prazos, anotações   | cursos concluídos, projetos, experiência, perfil  |
| Onde pode morar | em lugar privado — **o repositório é público**        | no git, como hoje                                 |
| O que exige     | ser mais rápido de atualizar do que não atualizar     | prova e revisão                                   |

A ponte entre os dois lados é um ato só, a **formatura**: um item em andamento
vira conteúdo público quando existe o comprovante e eu confirmo. Nada vai para o
site só porque marquei "concluído".

## Precisa de login?

Na primeira versão, não: o painel roda só no notebook. Login passa a ser
necessário no dia em que alguma parte dele for para a internet.

- **Publicar já tem login: é o meu push no GitHub.** Se o painel publica
  gerando um commit que eu reviso e envio do notebook, o site continua sem
  nenhuma rota de escrita, e a segurança dele não muda.
- **Organizar só precisa de login se estiver na internet.** Rodando só no
  notebook, quem protege é a sessão do Windows. "Sem login" não quer dizer "sem
  cuidado", porque um servidor local que grava arquivos pode ser acionado por
  qualquer página aberta no navegador. Por isso ele escuta só em `127.0.0.1`,
  exige um token gerado a cada vez que sobe (também para leitura, já que as
  anotações são privadas) e confere os cabeçalhos `Host` e `Origin`.
- **Para abrir no celular, precisa — e o login não deve ser escrito à mão.**
  Isso fica para uma atualização futura. Quando vier, em vez de senha, TOTP e
  cookie feitos por mim, o painel roda como processo separado do site, sem porta
  aberta, exposto por **Cloudflare Tunnel** com **Cloudflare Access** na frente.
  O login (código por e-mail, GitHub ou Google) é do Cloudflare, e o plano
  gratuito cobre até 50 usuários. O próprio túnel valida o token do Access,
  então não dá para contornar o login indo direto na VPS. A outra saída é o
  Tailscale, que não expõe nada na internet mas exige o app dele ligado no
  celular — e o notebook ligado, se o painel continuar rodando nele.

O que não fazer em caso nenhum: **login próprio dentro do binário que serve o
site.** Seria a primeira rota de escrita do site, aberta a qualquer um e
guardando ao mesmo tempo a honestidade dos números e as minhas anotações. Um bug
basta para alguém inflar um total sem que eu perceba.

## Organizar: o que o painel acompanha

Por item (curso, módulo, disciplina ou formação):

- **Status** em lista fechada: quero fazer, matriculada, em andamento, pausada,
  concluída (aguardando certificado), certificada, trancada, abandonada.
  Publicar é um ato à parte, não um status.
- **Progresso "X de Y"** na unidade de cada plataforma: disciplinas na pós (0 de
  6), cursos na formação da DIO, aulas no módulo do Curso em Vídeo. Digitado por
  mim, sem checklist aula a aula no começo.
- **Próximo passo** em uma linha ("PHP Moderno Módulo 02, aula 1") e o **link**
  para continuar (nunca a senha).
- **Prazos** com data de verdade, quando houver: liberação de módulo, prova,
  entrega, TCC, fim do acesso.
- **Anotação** curta.
- **Certificado**: data, carga ("30h", "o certificado não declara" ou "a
  conferir"), código ou link de validação, arquivo.
- **Último avanço**, gravado sozinho quando mexo no progresso.

A tela principal é a semana, em quatro blocos:

1. **Com data** — o que vence nos próximos 14 dias. Na prática, a pós.
2. **Em foco** — duas ou três frentes que eu escolho, com o próximo passo e o
   link.
3. **Parados** — em andamento sem avanço há mais de N dias. Com os dados de
   hoje, apareceriam a Formação React (último curso em junho de 2024), a
   Formação DevOps (julho de 2025) e o HTML5 e CSS3 (módulo 4 de 5, em maio de
   2023).
4. **Prontos para formatura** — concluídos sem certificado registrado, ou
   certificados ainda não publicados.

A semana serve para escolher, não para cobrar.

Fica de fora do começo: registro de tempo estudado, metas de horas, sequência de
dias, progresso público e integração com as plataformas, que exigiria as minhas
senhas num servidor e quebraria a cada mudança delas.

**Critério para saber se está servindo:** atualizar pelo painel tem de ser mais
rápido do que pedir ao Claude Code para editar o `data.go`, que é como faço
hoje. Se em um mês eu não estiver atualizando depois das aulas, o painel não
está funcionando — e é melhor descobrir isso antes de construir a versão
online.

## Publicar: a formatura

| Item                                | O que prova                                         | O que entra no site                                                                        |
| ----------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Matrícula                           | comprovante ou grade no portal                      | aparece como previsto e não conta em nada, como a pós hoje                                  |
| Curso ou módulo livre               | certificado emitido                                 | curso concluído; soma horas só se o certificado declarar a carga                           |
| Disciplina da pós, no meio do curso | *a decidir*: aprovação no portal ou declaração      | conta como curso; horas só se o documento declarar a carga da disciplina                   |
| Formação da DIO                     | *a decidir*: certificado da formação ou grade toda  | status "Concluída"                                                                         |
| Pós concluída                       | certificado e histórico                             | a carga certificada vai para o cartão, e o painel confere se as disciplinas somam o total |

Antes de confirmar, o painel mostra o que muda nos números — por exemplo,
"Cursos concluídos 58 → 59; Horas 1.009h → 1.049h; Back-end 1 → 2" —,
calculado pelas mesmas funções de `frontend/src/lib/courses.ts` que o site usa,
e não por uma cópia da regra. Se uma formatura mexe no total mais do que o
próprio item, o erro aparece antes de ir ao ar. Confirmada, ela vira um commit
com mensagem descritiva, do mesmo jeito que os de hoje ("Registra o curso de PHP
Moderno, concluído em setembro"); o CI roda os testes das regras e o deploy que
já existe publica.

### Regras que o painel não deixa quebrar

- **Só a carga do certificado entra em "Horas de estudo".** O tempo que eu
  registro é outra coisa: é autodeclarado, ninguém confere, e o módulo de PHP
  vale 40h no certificado tenha eu levado 15h ou 60h. No painel os dois têm
  nomes diferentes — "carga certificada" e "tempo registrado" — e nunca aparecem
  somados.
- **Carga prevista não é carga certificada.** As 400h do contrato da pós são
  previstas; só viram um "400h" seco quando o certificado sair.
- **Nunca estimar carga.** 400 ÷ 6 = 66,67h não é a carga de disciplina
  nenhuma.
- **Uma entrada pública, um comprovante.** O PHP Moderno Módulo 02 vai ser uma
  entrada nova, não uma edição do Módulo 01.
- **Status e área se escolhem numa lista, não se digitam.** O gráfico agrupa
  pelo texto exato: um "IA e automação" com minúscula criaria uma sétima barra e
  tiraria cursos da barra em destaque.
- **Nada privado no repositório público, nem em comentário.** O código da turma
  da pós já está num comentário do `data.go` e do fallback.

## Caminhos considerados

Nota de 0 a 10 dada por três avaliadores independentes, cada um com uma lente.

| Caminho                                   | Login                           | Celular     | Segurança | Manutenção | Propósito | Veredito |
| ----------------------------------------- | ------------------------------- | ----------- | :-------: | :--------: | :-------: | -------- |
| Painel local, no notebook                 | não (blindagem local)           | não         | 8         | 7          | 6,5       | escolhido |
| Notion para organizar + ponte para o site | o do Notion                     | pelo app    | 7         | 8          | 7         | descartado |
| Painel estático gravando pela API do GitHub | token do GitHub no navegador  | sim         | 5         | 5          | 6,5       | descartado |
| Painel dentro do binário Go da VPS        | próprio, escrito à mão          | sim         | 4         | 2,5        | 5         | descartado |

- **Painel estático com a API do GitHub:** um token com escrita no
  `portfolio-v3` não serve só para commitar. Ele também edita releases, então
  quem o tiver troca o pacote da `deploy-latest` que a VPS instala, sem commit e
  sem CI. Guardado no navegador do celular, isso equivale a rodar código na VPS.
- **Painel no binário Go:** login exposto no mesmo processo que serve o site,
  conteúdo saindo do git para um banco na VPS (acaba a revisão por diff, que é o
  que hoje segura a regra dos números), backup, e patch de segurança obrigatório
  mesmo nos meses em que eu não usar.
- **Notion + ponte:** é a menor construção, com app de celular pronto. Em troca,
  os estudos passam a viver num SaaS e a ponte passa a depender de um esquema
  que eu edito pela interface, sem versão nem teste — renomear uma propriedade
  quebra a publicação. Saiu porque o painel também é projeto meu: com o Notion,
  não sobra painel para construir.

## Recomendação, em fases

### Fase 0 — arrumar a base

> **Feita em 10/09/2026**, nos commits `6c5171f` a `6772022`. Ficaram de fora:
>
> - tirar do `authorized_keys` da VPS a chave pública que correspondia ao
>   `VPS_SSH_KEY` (à mão, pela SSH de casa);
> - remover da API o `planned` de compatibilidade (`Track.Planned` em
>   `models.go`) a partir de 17/09/2026, quando os bundles antigos em cache já
>   tiverem expirado.
>
> O `Cache-Control: no-cache` no `index.html` entrou em 15/09/2026, no commit
> `5c8d0a4`. Antes o navegador reaproveitava o HTML por horas depois de um
> deploy, e era isso que obrigava a manter um campo de compatibilidade como o
> `planned` a cada mudança de formato do conteúdo. Agora ele confere a cada
> visita e recebe 304 quando nada mudou.
>
> O currículo continua editado à mão. Ele ainda chama de "Portfólio v2" o site
> atual (`michellycruz.com.br`, com deploy na VPS), enquanto o site diz que a v2
> é o `v2.michellycruz.com.br`, estático.

Vale para qualquer caminho, inclusive se o painel nunca sair do papel. Leva por
volta de um dia com o Claude Code, e precisa acontecer logo: a primeira
disciplina concluída da pós já quebra o modelo atual. Hoje `planned` vale para a
trilha inteira, então com uma disciplina feita e cinco por vir ou a feita não
conta, ou as seis contam — 58 → 64 cursos, e "IA e Automação", a barra em
destaque do gráfico, de 6 para 10.

1. **Uma fonte de verdade.** O literal de `data.go` vira
   `backend/internal/content/portfolio.json`, embutido no binário com
   `go:embed` e lido com `DisallowUnknownFields` (um `"planed": true` digitado
   errado não pode passar calado e contar as seis matérias). O fallback importa
   o mesmo arquivo. Já foi testado com o TypeScript 6.0.3 e o Vite 8.2.1 do
   projeto: funciona sem mexer em `tsconfig` nem em `vite.config`, e
   `"hours": 30` ou um curso sem `area` quebram o build. As três cópias viram
   duas; o currículo continua à mão por enquanto.
2. **As regras viram teste.** Um `rules_test.go`, com `go test ./...` no
   `deploy.yml` antes do build: horas no formato `Nh`; área e status em lista
   fechada; item previsto sem data nem horas; `Education.hours` só em formação
   concluída; data de conclusão nunca no futuro; títulos únicos. O repositório
   não tem nenhum teste hoje.
3. **Status por curso** (concluído, cursando, previsto), com a trilha mantendo o
   seu. Só "concluído" entra em `studyTotals`, `coursesByArea` e `courseCounts`.
4. **Corrigir o que já afirma mais do que devia:**
   - o cartão da pós em IA mostra 400h no mesmo selo verde dos 540h concluídos,
     contra o próprio comentário de `models.go` ("only set for finished
     courses"); vira "400h previstas" em visual neutro, num campo à parte, para
     `hours` continuar querendo dizer carga certificada;
   - o cartão diz "Em andamento" e a trilha diz "aulas não iniciadas";
   - no currículo, as formações da DIO ganham "(em andamento)", e "cursando
     pós-graduação" vira o que for verdade no dia;
   - o PDF ganha um nome ou um `?v=` que mude a cada versão, porque o Cloudflare
     guarda o `.pdf` em cache por 4 horas.
5. **Higiene do repositório:**
   - apagar os secrets `VPS_HOST`, `VPS_USER` e `VPS_SSH_KEY` e as variables
     `DEPLOY_PATH` e `SERVICE_NAME`, que continuam cadastrados — o `DEPLOY.md`
     diz que podem ser apagados, não que foram —, e tirar a chave pública
     correspondente do `authorized_keys` da VPS;
   - criar um ruleset no `master` bloqueando force-push e exclusão.

Uma prévia dos totais já cabe aqui, sem painel: um script de poucas linhas que
importa `courses.ts` e imprime "58 cursos, 1.009h, 5 sem carga" antes e depois
de cada mudança.

### Fase 1 — o painel local, sem login

- **Repositório próprio, privado até a conclusão.** Uma pasta `painel/` no
  `portfolio-v3` seria pública desde o primeiro commit, e cada commit nela
  geraria release nova e reiniciaria o site. Num repositório à parte, o código
  fica fechado enquanto está pela metade e abre quando o painel entrar no
  portfólio. Como nesse dia o histórico inteiro fica público, nenhum dado meu
  entra nele, nem em teste ou exemplo: os exemplos usam dados fictícios.
- **Dados privados num repositório privado separado**, `estudos`, em texto
  (JSON + markdown): backup, histórico e leitura pelo app do GitHub no celular.
  Nunca numa pasta ignorada dentro do `portfolio-v3`: um `git add -f` publica
  tudo, e repositório público não esquece. Certificado com CPF fica no privado,
  ou no Drive com só o link.
- **Blindagem local:** escuta só em `127.0.0.1`, token por execução em todas as
  rotas, `Host` e `Origin` conferidos, token tirado da URL depois de carregado.
- **Publicar a partir de um clone dedicado**, e não da cópia em que desenvolvo —
  senão o push leva junto trabalho pela metade. `git add` só do
  `portfolio.json`, diff e totais antes e depois na tela, push confirmado por
  mim. É desse clone que vem o `courses.ts` da prévia dos totais: o painel mora
  em outro repositório, então importa a regra do site em vez de copiá-la (o
  Node 22.18+ do notebook já importa o `.ts` direto).
- **A primeira carga importa o que já existe:** os 58 cursos entram como
  certificados e publicados, a pós como matriculada, e as pendências da
  importação (datas em intervalo, cargas a conferir) viram a primeira lista de
  tarefas.

### Quando o painel entra no portfólio

Só depois de concluído, e "concluído" quer dizer:

- **A Fase 1 inteira funcionando:** a semana com os quatro blocos e a
  formatura publicando no `portfolio-v3`.
- **Em uso de verdade:** pelo menos um mês atualizando depois das aulas — o
  mesmo critério que diz se ele está servindo — e ao menos uma formatura real
  feita por ele.
- **Pronto para quem visita:** README com a arquitetura e as decisões de
  segurança, testes no CI, e capturas ou uma demonstração com dados fictícios.

O card do projeto descreve só o que existe. O acesso pelo celular não aparece
nele antes de existir.

### Fase 2 — o celular, numa atualização futura

Fora da primeira versão, por decisão. Quando vier, expõe **só a parte de
organizar**, como processo separado na VPS, escutando em `127.0.0.1` e
publicado por Cloudflare Tunnel com Access. Publicar continua saindo do
notebook: nenhuma credencial de escrita no `portfolio-v3` sai de lá.

## Perguntas em aberto

1. Disciplina da pós concluída no meio do curso: a aprovação no portal basta
   para entrar no site, ou nada da pós conta até o certificado final? conta sim, mas vamos ver como isso vai funcionar na pratica
2. Formação React, Formação DevOps e o módulo 5 de HTML5 e CSS3: retomar, marcar
   como pausados ou encerrar? E no currículo? não vou fazer o modulo 5 de html e css3, nem react. Devops estou quase terminando
3. Formação da DIO concluída exige o certificado da formação, ou basta ter todos
   os cursos da grade certificados? basta ter todos os cursos da grade
4. "Horas de estudo" passa a se chamar "Carga horária certificada", que é o que
   o número soma? sim, pode ser
5. Quero registrar o tempo real de estudo (sempre privado), ou o "último avanço"
   basta? não entendi a pergunta