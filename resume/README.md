# Currículo

Fonte do PDF que o site entrega em `/resume/curriculo_michelly.pdf`.

O PDF anterior tinha sido impresso à mão pelo Chrome e o HTML de origem se
perdeu — dava para ler o texto do PDF, mas não para editá-lo sem refazer tudo.
Por isso a fonte agora mora aqui, versionada.

## Regerar o PDF

```bash
bash resume/gerar-pdf.sh
```

O script imprime `curriculo.html` em
`frontend/public/resume/curriculo_michelly.pdf` com o Chrome em modo headless,
sem o cabeçalho e o rodapé que ele carimba por padrão.

## Formato ATS

`curriculo.html` é escrito para passar por leitor automático de currículo, o que
impõe algumas regras ao mexer nele:

- **Uma coluna só.** Nada lado a lado — o extrator lê na ordem do HTML, e duas
  colunas fazem o período de um emprego se colar no cargo do emprego seguinte.
- **Sem imagem, ícone, tabela de layout ou caixa de texto.** Só texto corrido.
- **Títulos de seção com os nomes que os parsers procuram**: PERFIL, EXPERIÊNCIA
  PROFISSIONAL, FORMAÇÃO ACADÊMICA, COMPETÊNCIAS TÉCNICAS, PROJETOS, CURSOS E
  CERTIFICAÇÕES.
- **Fonte de sistema** (Arial), nada incorporado.

Para conferir o que um ATS enxergaria depois de mexer:

```bash
pdftotext -enc UTF-8 frontend/public/resume/curriculo_michelly.pdf -
```

O texto tem de sair legível, acentuado e na mesma ordem da página.

## Relação com o conteúdo do site

O currículo espelha `backend/internal/content/data.go` (e o espelho dele em
`frontend/src/data/fallback-content.ts`). Quando um projeto, curso ou formação
mudar lá, mude aqui também e regere o PDF.
