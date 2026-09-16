# Prompt — piloto automático: portfolio-v3 + painel de estudos

> **Como rodar sem pedidos de permissão:** abra o terminal em
> `C:\Users\User\Documents\GitHub` e rode `claude --dangerously-skip-permissions`.
> Cole a **Versão completa** uma vez. Depois use `/loop` com a **Versão curta**.
> Numa tarefa agendada do Cowork, ative "Aprovar automaticamente".

---

## Versão completa

Você tem autonomia total sobre este trabalho. Não peça permissão nem
confirmação, e não pare para perguntar. Quando houver uma escolha a fazer,
decida pela opção mais conservadora e reversível, registre a decisão e siga em
frente. Trabalhe em ciclos: em cada um, pegue a próxima tarefa, implemente,
teste, faça o commit e o push, e passe para a seguinte.

### Onde tudo mora

Os caminhos abaixo ficam dentro de `C:\Users\User\Documents\GitHub\`.

| Pasta | Repositório | Visibilidade | O que é |
| --- | --- | --- | --- |
| `portfolio-v3/` | `michellycruz/portfolio-v3` | público | o site no ar. **Push no `master` = deploy em produção** |
| `painel/` | `michellycruz/painel` | **privado** | o código do painel de estudos |
| `estudos/` | `michellycruz/estudos` | **privado** | os dados reais do painel (JSON + markdown) |
| `portfolio-v3-publicar/` | clone do portfolio-v3 | — | clone dedicado de onde o painel publica |

Se algum repositório ou pasta ainda não existir, crie. Use `gh repo create
--private` para o `painel` e o `estudos`, e `git clone` para o clone dedicado.

**Na primeira rodada:**

1. Leia inteiros o `portfolio-v3/docs/painel.md`, o `README.md`, o
   `resume/README.md` e o `.github/DEPLOY.md`. O `painel.md` é a especificação:
   tudo o que ele decide vale aqui.
2. Crie `painel/CLAUDE.md` com um resumo destas regras. Crie também
   `painel/PLANO.md`, com o backlog abaixo em checklist, e `painel/DECISOES.md`.
   A cada ciclo, atualize esses arquivos. Eles são a sua memória entre rodadas.

### Regras que não se quebram

Estas regras protegem o site e os seus dados. Não são pedidos de permissão.

1. **Nenhum dado real no `painel`, nem em teste, exemplo ou comentário.** Ele
   vai virar público um dia, com o histórico inteiro. Use dados fictícios lá.
   Os dados reais ficam só no `estudos`. Nada de CPF nem de senha em nenhum
   repositório: certificado com CPF vai só como link.
2. **Nada de dado de teste ou fictício no `portfolio-v3`.** Tudo o que vai para
   o `master` dele aparece no site em minutos. Para testar a formatura, use um
   repositório git temporário ou `--dry-run`. Nunca o `portfolio-v3` de verdade.
3. **Não invente fatos sobre a Michelly:** curso, data, carga, nota ou
   certificado. A única fonte é o que já está no `portfolio.json`, no
   `curriculo.html` e no `painel.md`. Se faltar um dado, deixe como "a
   conferir", anote no `PLANO.md` e passe para outra tarefa.
4. **O `portfolio-v3` só recebe push com tudo verde.** Rode
   `cd backend && go vet ./... && go test ./...` e
   `cd frontend && npm run lint && npm run build`. Nunca use `--force`, porque o
   ruleset do `master` bloqueia. Nunca afrouxe nem apague teste para ele
   passar.
5. **O ruído de CRLF.** O `git status` do `portfolio-v3` mostra cerca de 57
   arquivos modificados, mas quase tudo é só fim de linha. Nunca rode
   `git add .` nem `git add -A` ali. Adicione os arquivos pelo nome e confira
   com `git diff --cached --ignore-cr-at-eol`. Não descarte mudanças locais.

### Backlog

#### A. Fechar a Fase 0 no portfolio-v3 (rápido, primeiro)

1. O `Cache-Control: no-cache` do `index.html` já está no `backend/main.go`,
   mas ainda não tem commit. Escreva um teste em `main_test.go` provando que o
   `index.html` sai com `no-cache` e que `/assets/*` não sai. Faça o commit dos
   dois juntos e o push.
2. **A partir de 17/09/2026**, e só depois do item 1 estar no ar, remova o
   `Track.Planned` de compatibilidade (`models.go` e os usos dele). Até essa
   data, pule este item e volte a ele depois.
3. A chave antiga no `authorized_keys` da VPS: só remova se conseguir
   identificar com certeza qual é, pela SSH de casa. Na dúvida, não mexa e
   registre no `PLANO.md`.
4. Atualize o `docs/painel.md`: marque o que ficou feito e anote o commit.

#### B. Fase 1: o painel local (o foco)

Siga o `painel.md` à risca. Em resumo:

- **Stack:** servidor local em Go só com a stdlib, no mesmo padrão do backend do
  portfólio. Front em React + Vite + TypeScript, na identidade visual do
  portfolio-v3. Se precisar escolher outra coisa, registre o motivo no
  `DECISOES.md`.
- **Blindagem:** o servidor escuta só em `127.0.0.1` e gera um token por
  execução, exigido em todas as rotas, inclusive nas de leitura. Ele confere os
  cabeçalhos `Host` e `Origin`, e o front tira o token da URL depois de
  carregar. Escreva testes para cada uma dessas proteções.
- **Dados:** lidos e gravados em `../estudos/`, em JSON + markdown. Cada
  gravação vira um commit automático no `estudos`, com push.
- **Modelo por item:** status em lista fechada (quero fazer, matriculada, em
  andamento, pausada, concluída aguardando certificado, certificada, trancada,
  abandonada); progresso "X de Y"; próximo passo; link; prazos; anotação;
  certificado (data, carga "30h", "não declara" ou "a conferir", validação,
  link); e último avanço, gravado sozinho.
- **Tela da semana, com os quatro blocos:** com data (14 dias), em foco, parados
  (há mais de N dias, configurável) e prontos para formatura.
- **Formatura:** mostra o diff do `portfolio.json` e os totais antes e depois,
  calculados importando o `frontend/src/lib/courses.ts` do clone dedicado com o
  Node 22.18+. Nunca copie a regra. Depois de confirmada na interface, grava
  **só** o `portfolio.json`, faz o commit com mensagem no estilo do repositório
  e o push. O painel não deixa quebrar nenhuma das regras de "Regras que o
  painel não deixa quebrar".
- **Primeira carga:** importe do `portfolio.json` real para o `estudos`. Os 58
  cursos entram como certificados e publicados, e a pós como matriculada. As
  pendências da importação viram a primeira lista de tarefas dentro do painel.
- **Qualidade:** testes no CI do `painel` (GitHub Actions: `go test`, lint e
  build). O README explica a arquitetura e as decisões de segurança. Faça
  capturas com dados fictícios.

Faça em fatias verticais, cada uma funcionando de ponta a ponta:

1. Servidor com a blindagem.
2. Leitura e gravação no `estudos`.
3. Importação.
4. Lista e edição de itens.
5. Semana.
6. Formatura em modo de teste.
7. Formatura real.
8. CI e README.

#### C. As perguntas em aberto do `painel.md`

Não trave nelas. Implemente cada uma como **configuração**, com o padrão mais
conservador:

1. Uma disciplina da pós só conta depois do certificado final.
2. Uma formação da DIO só conta com o certificado da própria formação.
3. Os itens parados continuam como estão, e o painel só os mostra.
4. O rótulo do site não muda.
5. Não há registro de tempo real, só o último avanço.

Registre cada padrão no `DECISOES.md`, com o nome da opção que o troca.

#### D. Depois da Fase 1

- Qualidade do portfolio-v3: acessibilidade, lint e peso do bundle, sem mudar a
  identidade visual.
- **Não** coloque o painel no portfólio: o critério do `painel.md` exige um mês
  de uso real. **Não** comece a Fase 2 (acesso pelo celular).
- Com tudo pronto, escreva no `PLANO.md` até cinco próximos passos e encerre o
  loop.

### Estilo

- Commits em português, com o verbo no presente e na 3ª pessoa, dizendo o
  porquê. Exemplo: "Mostra as 400h da pós em IA como previstas".
- Comentários em Go e YAML ficam sem acento e explicam o motivo, não o óbvio.
- Use o mínimo de dependências.

### Se algo der errado

Se um teste falhar três vezes pelo mesmo motivo, ou se uma ferramenta não
estiver disponível (`gh` sem login, Node antigo), registre no `PLANO.md` o que
tentou e o erro, e passe para a próxima tarefa que não dependa disso. Só
encerre quando não sobrar nenhuma tarefa possível.

### Resumo de cada ciclo, em 4 linhas

1. O que foi feito, com os commits.
2. O resultado dos testes.
3. As decisões tomadas.
4. A próxima tarefa.

---

## Versão curta (para `/loop` ou tarefa agendada)

Continue o piloto automático do portfolio-v3 e do painel de estudos, em
`C:\Users\User\Documents\GitHub`. Leia `painel/CLAUDE.md`, `painel/PLANO.md` e
`painel/DECISOES.md` e faça a próxima tarefa aberta, sem pedir permissão.
Decida pelo mais conservador e registre. Nenhum dado real no `painel`, nenhum
dado fictício no `portfolio-v3`, e push no `portfolio-v3` só com
`go test`, `lint` e `build` verdes. Atualize o `PLANO.md` e termine com o
resumo de 4 linhas. Se o `PLANO.md` estiver todo concluído, encerre o loop.
