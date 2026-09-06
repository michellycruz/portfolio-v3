# Portfólio — Michelly Cruz (v3)

Base de um novo portfólio, partindo do código do [portfolio-v2](https://github.com/michellycruz/portfolio-v2):
mesmo backend em **Go** e mesma camada de conteúdo, com o frontend refeito em
outra identidade visual — neobrutalismo escuro, tipografia Archivo Black +
JetBrains Mono e acentos em laranja, amarelo, menta e rosa.

## O que muda em relação à v2

- **Página inicial de tela cheia** (`Landing`): foto, nome, resumo profissional e
  os links de contato. Sem menu à vista.
- **Menu lateral que só aparece na rolagem**: passou da capa, a barra da esquerda
  entra deslizando e passa a destacar a seção que está sendo lida. No celular ela
  vira gaveta, aberta pelo botão da barra do topo.
- **Tema escuro como padrão**, com o claro guardado no `localStorage`.
- Seções reescritas em cartões com borda de 2px e sombra dura: Sobre,
  Experiência, Formação, Habilidades, Projetos e Contato.

O backend, os tipos (`src/types/content.ts`), o conteúdo de reserva
(`src/data/fallback-content.ts`) e o cliente da API seguem os mesmos da v2.

## Estrutura

```
Portfolio-novo/
├── backend/    # API em Go (conteúdo + formulário de contato) — igual à v2
└── frontend/   # React 19 + Vite + Tailwind v4
    └── src/
        ├── components/layout/    # Landing, Sidebar, Topbar, ThemeToggle, Footer
        ├── components/sections/  # Sobre, Experiência, Formação, Habilidades, Projetos, Contato
        ├── components/ui/        # Card, Button, SectionHeading, SocialIcon
        ├── hooks/useScrollNav.ts # rolagem passou da capa, seção ativa, media query
        └── lib/                  # api, nav, tech (rótulos e cores das tecnologias)
```

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
- As seções são componentes independentes — dá para reordená-las no `App.tsx`
  junto com a lista de `frontend/src/lib/nav.ts`, que alimenta o menu, o rastro
  do topo e o destaque da seção ativa.
