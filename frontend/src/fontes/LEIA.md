# Fontes

As três fontes do site, servidas por ele mesmo e não pelo Google:

| Arquivo | Família | De onde veio |
| --- | --- | --- |
| `archivo.woff2` | Archivo (variável, pesos 100–900) | Google Fonts, subconjunto latin |
| `archivo-black.woff2` | Archivo Black | Google Fonts, subconjunto latin |
| `jetbrains-mono.woff2` | JetBrains Mono (variável) | Google Fonts, subconjunto latin |

As duas famílias são licenciadas sob a **SIL Open Font License 1.1**, que
permite hospedar e redistribuir os arquivos junto com o site.

**Por que hospedar em vez de carregar do Google:** a folha de estilo do Google
Fonts bloqueia a primeira pintura e custa duas conexões novas (`fonts.googleapis.com`
e `fonts.gstatic.com`) antes de a fonte começar a baixar. Servidas daqui, elas
vêm pela conexão que já está aberta, entram no cache imutável do `/assets` — o
Vite põe um hash no nome — e ninguém que visita o site precisa pedir nada ao
Google.

**Para atualizar:** pegue a URL do `.woff2` na folha que o Google serve para
`fonts.googleapis.com/css2?family=Archivo:wght@400..700&family=Archivo+Black&family=JetBrains+Mono:wght@400..700`
(o bloco cujo `unicode-range` começa em `U+0000-00FF` é o latin) e troque o
arquivo. O `@font-face` fica em `src/index.css`.
