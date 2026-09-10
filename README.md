# Portfólio — Michelly Cruz (v3)

Base de um novo portfólio, partindo do código do [portfolio-v2](https://github.com/michellycruz/portfolio-v2):
do backend em **Go** e da camada de conteúdo dela, com o frontend refeito em
outra identidade visual — neobrutalismo escuro, tipografia Archivo Black +
JetBrains Mono e uma paleta terrosa: barro, ocre, sálvia e rosa-seco sobre
papel/carvão.

## O que muda em relação à v2

- **Página inicial de tela cheia** (`Landing`): foto, nome, resumo profissional e
  os links de contato. Sem menu à vista.
- **Menu lateral que só aparece na rolagem**: passou da capa, a barra da esquerda
  entra deslizando e passa a destacar a seção que está sendo lida. No celular ela
  vira gaveta, aberta pelo botão da barra do topo.
- **Tema escuro como padrão**, com o claro guardado no `localStorage`.
- Seções reescritas em cartões com borda de 2px e sombra dura: Sobre,
  Experiência, Formação, Habilidades, Projetos e Contato.

O cliente da API (`src/lib/api.ts`) segue o da v2. O backend e os tipos mudaram:
o conteúdo saiu do código, mora em `backend/internal/content/portfolio.json` e
segue regras próprias (veja [Conteúdo](#conteúdo)).

## Estrutura

```
Portfolio-novo/
├── backend/    # API em Go: conteúdo (portfolio.json, embutido no binário) + formulário de contato
├── resume/     # fonte HTML do currículo em PDF (formato ATS) + script que o gera
└── frontend/   # React 19 + Vite + Tailwind v4
    └── src/
        ├── components/layout/    # Landing, Sidebar, Topbar, ThemeToggle, Footer
        ├── components/sections/  # Sobre, Experiência, Formação, Habilidades, Projetos, Contato
        ├── components/ui/        # Card, Button, SectionHeading, SocialIcon
        ├── hooks/useScrollNav.ts # rolagem passou da capa, seção ativa, media query
        └── lib/                  # api, nav, tech (rótulos e cores das tecnologias)
```

## Conteúdo

Tudo o que o site mostra (perfil, experiência, formação, cursos e projetos) mora
em `backend/internal/content/portfolio.json`. O Go embute o arquivo no binário e
o serve em `/api/content`; o front importa o mesmo arquivo como conteúdo de
reserva, para a página nunca ficar em branco. Para mudar o site, é esse o arquivo
a editar.

Os números da seção de formação ("Cursos concluídos", "Horas de estudo", o
gráfico por área) são calculados a partir dele, então o arquivo segue regras:

- cada curso tem um `status`: `concluido`, `cursando` ou `previsto`. Só
  `concluido` conta. Data e carga vêm do certificado, então só ele as tem, e
  sempre pelo menos uma das duas;
- a carga é sempre em horas inteiras no formato `"30h"`, e um curso sem carga
  declarada conta como curso mas não soma horas;
- a área sai de uma lista fechada, porque o gráfico agrupa pelo texto exato;
- carga de formação em andamento vai em `plannedHours` e aparece como prevista;
- quando a grade de uma formação aparece como trilha, as disciplinas não somam
  mais do que a carga do cartão e, com a formação concluída, fecham exatamente
  nela.

As regras são testes, em `backend/internal/content/rules_test.go`, e o CI roda
`go test ./...` antes de qualquer build. Para ver o efeito de uma mudança nos
totais antes do commit:

```bash
cd frontend
npm run totais   # último commit x cópia de trabalho, com as mesmas funções do site
```

A coluna do último commit usa o `courses.ts` daquele commit, então uma mudança
na própria regra de contagem também aparece. O script roda TypeScript direto no
Node, o que pede o Node 22.18 ou mais novo.

## Rodando

```bash
# frontend
cd frontend
npm install
npm run dev      # http://localhost:5173

# backend (opcional em desenvolvimento)
cd backend
go run .         # http://localhost:8080
```

Sem o backend no ar, o frontend cai no conteúdo local de reserva e mostra um
aviso no topo — a página nunca fica em branco.

Para produção:

```bash
cd frontend && npm run build          # gera frontend/dist
cd ../backend && STATIC_DIR=../frontend/dist go run .
```

As variáveis de ambiente do backend (SMTP, CORS, porta) estão documentadas em
`backend/.env.example` e seguem as mesmas regras da v2: em deploy o servidor se
recusa a subir sem SMTP configurado, para o formulário não dar "enviado" sem
enviar nada.

## Onde continuar

- Trocar o texto do currículo e a foto (`frontend/public/images/foto-pessoal.jpg`).
- Ajustar a paleta em `frontend/src/index.css` (bloco `:root` / `html.dark`).
  Outras três ficam no mesmo arquivo atrás de `html[data-palette="…"]` — `riso`
  (tintas de risografia sobre papel frio), `vitral` (acentos profundos de pedra,
  com texto claro por cima) e `polar` (fria e contida) —, e um botão que só
  existe em desenvolvimento alterna entre as quatro para comparar.
- As seções são componentes independentes — dá para reordená-las no `App.tsx`
  junto com a lista de `frontend/src/lib/nav.ts`, que alimenta o menu, o rastro
  do topo e o destaque da seção ativa.
