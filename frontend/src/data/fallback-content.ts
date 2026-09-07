import type { Content } from "../types/content";

// Mirrors backend/internal/content/data.go. Used only if the Go API is
// unreachable, so the site never renders blank in front of a recruiter.
export const fallbackContent: Content = {
  profile: {
    name: "Michelly Cruz",
    role: "Analista de Sistemas",
    location: "Espírito Santo, Brasil",
    summary: [
      "Analista de Sistemas na Hostbraza. Hoje construo o checkout do novo ecossistema de vendas da empresa: carrinho, pagamento e área do cliente em React e TypeScript, sobre uma API própria em Go que valida o acesso e concentra as integrações.",
      "Venho do suporte técnico e da análise de sistemas — GLPI, SQL, levantamento de requisitos e protótipos —, e dali trago o hábito de documentar e testar. Desenvolvo com apoio de IA, revisando o que entra em produção.",
    ],
    profileBadge: "Planejador Analista (PA)",
    behavior: [
      { label: "Executor", percent: 13 },
      { label: "Comunicador", percent: 22 },
      { label: "Planejador", percent: 33 },
      { label: "Analista", percent: 33 },
    ],
    photoUrl: "/images/foto-pessoal.jpg",
    resumeUrl: "/resume/curriculo_michelly.pdf",
    social: [
      { name: "LinkedIn", url: "https://www.linkedin.com/in/michxcrz/", icon: "linkedin" },
      { name: "Instagram", url: "https://www.instagram.com/michxcrz00/", icon: "instagram" },
      { name: "GitHub", url: "https://github.com/michellycruz", icon: "github" },
      { name: "WhatsApp", url: "https://wa.me/5527996942003", icon: "whatsapp" },
    ],
  },
  experience: [
    {
      company: "Hostbraza LTDA",
      role: "Analista de Sistemas",
      period: "Abril 2026 - Atual",
      bullets: [
        "Desenvolvimento do checkout do novo ecossistema de vendas da empresa (projeto interno): carrinho, cadastro, pagamento e resumo do pedido em React e TypeScript, sobre uma API própria em Go.",
        "Integração com gateway de pagamento: parcelamento coerente com o plano contratado, cupom, webhook de confirmação e idempotência contra cobrança duplicada.",
        "Autenticação via OIDC validada na API em Go, vínculo com o cliente já existente na base e CPF, CNPJ e endereço conferidos ainda no navegador.",
        "Plugins e aplicações para WordPress em PHP, além da manutenção das aplicações web da empresa.",
        "Desenvolvimento orientado por IA com o Claude Code, com revisão minha do que vai para produção.",
        "Atendimento N1 aos clientes de hospedagem.",
      ],
      results:
        "Checkout levado do zero ao ponto de operar, com o fluxo de pagamento coberto contra cobrança duplicada, confirmação perdida e parcelamento incompatível com o meio de pagamento.",
    },
    {
      company: "Secretaria de Estado da Educação - SEDU",
      role: "Analista de Sistemas",
      period: "Outubro 2023 - Setembro 2024",
      bullets: [
        "Atendimento e resolução de chamados técnicos (GLPI) relacionados aos sistemas educacionais.",
        "Consultas SQL no banco de dados para extração e análise de informações.",
        "Criação de protótipos de interface em Figma e Balsamiq para apoio no design e no levantamento de requisitos.",
        "Colaboração em reuniões de análise e levantamento de requisitos de sistemas para identificar necessidades de negócios.",
        "Atendimento e suporte ao usuário final.",
      ],
      results:
        "Redução de retrabalho em homologações ao estruturar melhor os testes; maior clareza em fluxos de processos com documentação aplicada.",
    },
    {
      company: "Multivix",
      role: "Secretária",
      period: "Abril 2021 - Outubro 2023",
      bullets: [
        "Suporte direto aos alunos (presencial ou remoto).",
        "Controle e organização de processos administrativos.",
        "Gestão de provas presenciais e apoio acadêmico.",
      ],
      results:
        "Melhoria no fluxo de atendimento aos alunos, com otimização no tempo de resposta às demandas acadêmicas.",
    },
  ],
  education: [
    {
      course: "CST em Análise e Desenvolvimento de Sistemas",
      institution: "Multivix - Empresa Brasileira de Ensino Pesquisa e Extensão",
      period: "Julho 2021 - Julho 2023",
    },
    {
      course: "Pós-graduação em Engenharia de Software",
      institution: "Descomplica - Centro Universitário União das Américas",
      period: "Agosto 2023 - Agosto 2024",
      hours: "540h",
    },
    {
      course: "Bacharelado em Ciência da Computação",
      institution: "UNINTER - Centro Universitário Internacional",
      period: "Junho 2024 - Trancado em maio de 2025",
    },
  ],
  institutions: [
    {
      name: "Descomplica - UniAmérica",
      tracks: [
        {
          // Disciplinas e cargas horárias conforme o histórico escolar do
          // certificado de conclusão, que soma exatamente as 540h do curso.
          name: "Pós-graduação em Engenharia de Software",
          status: "Concluída",
          courses: [
            { title: "Programação Extrema", date: "Janeiro 2024", hours: "60h", area: "Processos e Design" },
            { title: "Essencial DataBase", date: "Fevereiro 2024", hours: "30h", area: "Dados e Fundamentos" },
            { title: "Lógica de Programação com Java", date: "Fevereiro 2024", hours: "30h", area: "Dados e Fundamentos" },
            { title: "Interface de Software", date: "Fevereiro 2024", hours: "60h", area: "Processos e Design" },
            { title: "Gerenciamento Avançado de Projetos", date: "Fevereiro 2024", hours: "60h", area: "Processos e Design" },
            { title: "Metodologias de Desenvolvimento de Software", date: "Fevereiro 2024", hours: "30h", area: "Processos e Design" },
            { title: "Estrutura de Dados para Sistemas Inteligentes", date: "Março 2024", hours: "60h", area: "Dados e Fundamentos" },
            { title: "Arquitetura de BI e Big Data", date: "Abril 2024", hours: "60h", area: "Dados e Fundamentos" },
            { title: "Plataformas para Desenvolvimento na Nuvem", date: "Maio 2024", hours: "60h", area: "Infra e DevOps" },
            { title: "Arquitetura e Modelagem de Dados", date: "Junho 2024", hours: "30h", area: "Dados e Fundamentos" },
            { title: "Análise de Dados e BI para Tomada de Decisão", date: "Julho 2024", hours: "30h", area: "Dados e Fundamentos" },
            { title: "Cloud Diversity AWS", hours: "30h", area: "Infra e DevOps" },
          ],
        },
      ],
    },
    {
      name: "DIO - Digital Innovation One",
      tracks: [
        {
          name: "Formação IA Generativa",
          status: "Em andamento",
          courses: [
            { title: "Introdução aos Fundamentos de IA Generativa com a Universia", date: "Outubro 2025", hours: "1h", area: "IA e Automação" },
            { title: "Aplicações e Impacto da IA no Mundo Atual", date: "Maio 2026", hours: "1h", area: "IA e Automação" },
            { title: "Aplicações Práticas da Inteligência Artificial", date: "Maio 2026", hours: "2h", area: "IA e Automação" },
            { title: "A Era da IA: Machine Learning, LLMs, IA Generativa e Agentes", date: "Maio 2026", hours: "2h", area: "IA e Automação" },
            { title: "Introdução à Engenharia de Prompts", date: "Junho 2026", hours: "1h", area: "IA e Automação" },
          ],
        },
        {
          name: "Formação React",
          status: "Em andamento",
          courses: [
            { title: "Configuração de Ambiente React", date: "Maio 2024", hours: "1h", area: "Front-end" },
            { title: "Páginas Web com HTML", date: "Maio 2024", hours: "2h", area: "Front-end" },
            { title: "Estilizando Páginas com CSS", date: "Maio 2024", hours: "1h", area: "Front-end" },
            { title: "Tornando Páginas Web Interativas com JavaScript", date: "Maio 2024", hours: "2h", area: "Front-end" },
            { title: "Entendendo a DOM (Document Object Model)", date: "Maio 2024", hours: "1h", area: "Front-end" },
            { title: "Primeiros Passos na Biblioteca React", date: "Maio 2024", hours: "1h", area: "Front-end" },
            { title: "Criando Uma Calculadora Com React", date: "Maio 2024", hours: "1h", area: "Front-end" },
            { title: "Criando um Projeto React do Zero", date: "Junho 2024", hours: "1h", area: "Front-end" },
            { title: "Convenções e Qualidade de Código React", date: "Junho 2024", hours: "1h", area: "Front-end" },
          ],
        },
        {
          name: "Formação DevOps",
          status: "Em andamento",
          courses: [
            { title: "Onboarding - DevOps", date: "Junho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "Entendendo O que é DevOps", date: "Junho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "DevOps e Processos de Desenvolvimento de Software", date: "Junho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "Introdução ao DevSecOps", date: "Junho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "Qual é a diferença entre SRE e DevOps", date: "Junho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "Introdução ao DevOps com CI/CD", date: "Junho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "Criando seu Primeiro Projeto de DevOps com GitLab", date: "Junho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "Cloud Computing e o DevOps", date: "Julho 2025", hours: "1h", area: "Infra e DevOps" },
            { title: "Infraestrutura como Código no DevOps", date: "Julho 2025", hours: "1h", area: "Infra e DevOps" },
          ],
        },
        {
          name: "DIO Campus Expert (13ª turma)",
          status: "Concluída",
          courses: [
            { title: "Onboarding | Boas-vindas ao DIO Campus Expert Turma 13", date: "Agosto 2025", hours: "1h", area: "Processos e Design" },
            {
              title: "Como desenvolver a sua Liderança e Protagonismo como embaixador(a) da DIO!",
              date: "Agosto 2025",
              hours: "2h",
              area: "Processos e Design",
            },
            { title: "Programa DIO Campus Expert", date: "Agosto - Setembro 2025", hours: "30h", area: "Processos e Design" },
          ],
        },
      ],
    },
    {
      name: "Conquer Business School",
      courses: [
        {
          title: "Inteligência Artificial: eleve sua produtividade e acelere sua carreira",
          date: "Junho 2024",
          hours: "10h",
          area: "IA e Automação",
        },
      ],
    },
    {
      name: "Curso em Vídeo",
      courses: [
        { title: "MySQL", date: "Fevereiro 2023", hours: "40h", area: "Dados e Fundamentos" },
        { title: "Curso HTML5 e CSS3: Módulo 1 de 5", date: "Março 2023", hours: "40h", area: "Front-end" },
        { title: "Curso HTML5 e CSS3: Módulo 2 de 5", date: "Abril 2023", hours: "40h", area: "Front-end" },
        { title: "Curso HTML5 e CSS3: Módulo 3 de 5", date: "Abril 2023", hours: "40h", area: "Front-end" },
        { title: "Curso HTML5 e CSS3: Módulo 4 de 5", date: "Maio 2023", hours: "40h", area: "Front-end" },
        { title: "JavaScript", date: "Junho 2023", hours: "40h", area: "Front-end" },
        { title: "Segurança da Informação: Módulo 00", date: "Setembro 2023", hours: "20h", area: "Infra e DevOps" },
        { title: "Algoritmo", date: "Setembro 2025", hours: "40h", area: "Dados e Fundamentos" },
      ],
    },
    {
      name: "OneBitCode",
      courses: [
        { title: "Análise de Requisitos", date: "Abril 2024", area: "Processos e Design" },
        { title: "Metodologias Ágeis - SCRUM", date: "Abril 2024", area: "Processos e Design" },
        { title: "Web Scraping", date: "Abril 2024", area: "Dados e Fundamentos" },
        { title: "UI/UX Design", date: "Maio 2024", area: "Processos e Design" },
        { title: "Sass", date: "Maio 2024", hours: "2h", area: "Front-end" },
        { title: "Tailwind CSS", date: "Maio 2024", area: "Front-end" },
        { title: "Bootstrap", date: "Maio 2024", hours: "7h", area: "Front-end" },
        { title: "JavaScript I, II, III, IV, V e VI", date: "Outubro 2024", hours: "40h", area: "Front-end" },
        { title: "TypeScript", date: "Outubro 2024", hours: "5h", area: "Front-end" },
      ],
    },
    {
      name: "Cubos Academy",
      courses: [{ title: "Minicurso de UX/UI Design", date: "Junho 2024", hours: "5h", area: "Processos e Design" }],
    },
  ],
  infraSkills: [
    {
      title: "Suporte a Usuários",
      description: "Atendimento via GLPI, resolução de chamados, instalação e configuração de softwares e aplicativos.",
      highlights: [
        "Atendimento primário a usuários internos e externos.",
        "Acompanhamento completo de chamados, do registro à solução.",
      ],
    },
    {
      title: "Manutenção e Hardware",
      description: "Correções preventivas e corretivas, atualização de antivírus, configuração de impressoras.",
      highlights: [
        "Manutenção de hardware e software (instalação, configuração e suporte).",
        "Programação e configuração de impressoras.",
        "Atualização de antivírus e segurança básica.",
        "Monitoramento de conexões de rede.",
      ],
    },
    {
      title: "Infraestrutura em Nuvem",
      description: "Gerenciamento de serviços em nuvem AWS e Azure, configuração e manutenção de servidores virtuais, implementação de soluções de backup e recuperação em nuvem.",
      highlights: [
        "Administração e suporte em ambientes de nuvem (AWS e Azure).",
        "Criação e gerenciamento de recursos de infraestrutura em cloud.",
      ],
    },
  ],
  skillCategories: [
    { title: "Prototipação", skills: ["figma", "balsamiq"] },
    { title: "Ferramentas", skills: ["sql", "gitlab", "git", "github-icon", "excel", "teams", "word", "outlook", "notion"] },
    { title: "Linguagens e Frameworks", skills: ["html", "css", "js", "ts", "php", "go", "bootstrap", "sass", "react", "tailwind"] },
    { title: "Inteligência Artificial", skills: ["ia"] },
  ],
  projects: [
    {
      title: "Checkout de pagamento",
      year: "2026",
      description:
        "Projeto interno, sob sigilo: carrinho, pagamento e área do cliente em React e TypeScript sobre uma API em Go, com trava contra cobrança duplicada e parcelamento coerente com o meio de pagamento.",
      tech: ["react", "ts", "go"],
      imageUrl: "",
      linkUrl: "",
      repoUrl: "",
      private: true,
    },
    {
      title: "Portfólio v2",
      year: "2026",
      description:
        "A versão anterior deste portfólio. React, TypeScript e Tailwind no front, API própria em Go no back e um timer na VPS que puxava cada build novo direto da release. Hoje está no ar como site estático.",
      tech: ["react", "ts", "tailwind", "go"],
      imageUrl: "/images/projects/portfolio_v2.png",
      linkUrl: "https://portfolio-v2-six-lac-34.vercel.app",
      repoUrl: "https://github.com/michellycruz/portfolio-v3/tree/v2",
      private: false,
    },
    {
      title: "Otimizador WordPress",
      year: "2026",
      description:
        "Plugin com tela de configurações onde cada otimização liga e desliga sozinha: remover scripts de emoji, desativar embeds, limitar revisões, defer nos scripts e heartbeat mais lento.",
      tech: ["php"],
      imageUrl: "",
      linkUrl: "",
      repoUrl: "",
      private: true,
    },
    {
      title: "Avisos de Hospedagem",
      year: "2026",
      description:
        "Plugin WordPress que reúne avisos de hospedagem — domínio expirando, conta a vencer, disco cheio — no wp-admin e no site. Cada aviso é um custom post type.",
      tech: ["php"],
      imageUrl: "",
      linkUrl: "",
      repoUrl: "https://github.com/michellycruz/hostbraza-avisos",
      private: false,
    },
    {
      title: "Portal Fiscal",
      year: "2025",
      description:
        "Portal interno do setor fiscal de uma empresa, organizado por módulos. O primeiro deles cuida da entrada de notas fiscais.",
      tech: ["html", "css", "js"],
      imageUrl: "/images/projects/setor_fiscal.png",
      linkUrl: "https://setor-fiscal-cedisa.vercel.app",
      repoUrl: "",
      private: true,
    },
    {
      title: "Go Gateway API",
      year: "2025",
      description:
        "Primeira API em Go: gateway de pagamento com domínio, repositório e serviço separados, migrations e Docker Compose. Parou no cadastro de contas — mas é a estrutura que uso hoje.",
      tech: ["go"],
      imageUrl: "",
      linkUrl: "",
      repoUrl: "",
      private: true,
    },
    {
      title: "Agency",
      year: "2024",
      description:
        "Segunda landing page do módulo de Sass. Reaproveitar os parciais do Electrum foi o que deixou claro o ganho de manter o estilo em módulos.",
      tech: ["html", "sass"],
      imageUrl: "/images/projects/agency.png",
      linkUrl: "https://projetos-sass-agency.vercel.app",
      repoUrl: "",
      private: true,
    },
    {
      title: "Electrum",
      year: "2024",
      description:
        "Landing page em Sass: variáveis, aninhamento e parciais no lugar de um CSS único. O exercício era organizar o estilo, não só escrevê-lo.",
      tech: ["html", "sass"],
      imageUrl: "/images/projects/electrum.png",
      linkUrl: "https://electrum-sass.vercel.app",
      repoUrl: "",
      private: true,
    },
    {
      title: "Código Certo",
      year: "2024",
      description:
        "Página pessoal da trilha Front-End Jr da Código Certo Coders: apresentação, gostos, motivações e currículo para baixar.",
      tech: ["html", "css", "bootstrap"],
      imageUrl: "/images/projects/codigo_certo.png",
      linkUrl: "https://trilha-front-end-jr-michelly-cruz.vercel.app/",
      repoUrl: "https://github.com/michellycruz/TrilhaFrontEndJR-JUN15",
      private: false,
    },
    {
      title: "Página de Emails",
      year: "2024",
      description:
        "Interface de webmail em React: entrada, enviados, rascunhos, arquivados, spam e lixeira, com busca. Primeiro projeto em que a tela virou componente.",
      tech: ["react", "tailwind"],
      imageUrl: "/images/projects/pagina_de_emails.png",
      linkUrl: "https://paginadeemail.vercel.app/",
      repoUrl: "",
      private: true,
    },
    {
      title: "Calculadora de Gorjetas",
      year: "2024",
      description:
        "Recebe o valor da conta e a qualidade do serviço, devolve quanto deixar de gorjeta e o total a pagar.",
      tech: ["html", "css", "js"],
      imageUrl: "/images/projects/calculadora_de_gorjetas.png",
      linkUrl: "https://michellycruz.github.io/projetos_javascript/9_calculadora_de_gorjetas//",
      repoUrl: "https://github.com/michellycruz/projetos_javascript",
      private: false,
    },
    {
      title: "Carrinho de Compras",
      year: "2024",
      description:
        "Vitrine com busca e carrinho em React, com o estado num Context. A API que alimentava a lista fechou e o site travava carregando: troquei a fonte de dados e dei tratamento à falha.",
      tech: ["react", "js", "css"],
      imageUrl: "/images/projects/carrinho_de_compras.png",
      linkUrl: "https://carrinho-de-compras-delta.vercel.app",
      repoUrl: "https://github.com/michellycruz/carrinho_de_compras",
      private: false,
    },
    {
      title: "Piano",
      year: "2024",
      description:
        "Piano tocável pelo mouse ou pelo teclado, com as teclas identificadas sob demanda. Cada nota é uma amostra de áudio disparada por JavaScript.",
      tech: ["html", "css", "js"],
      imageUrl: "/images/projects/piano.png",
      linkUrl: "https://piano-zlpu.vercel.app",
      repoUrl: "https://github.com/michellycruz/piano",
      private: false,
    },
    {
      title: "Jogo da Memória",
      year: "2023",
      description:
        "Tela de login, cartas embaralhadas a cada partida e a lógica de virar, comparar e travar os pares em JavaScript puro.",
      tech: ["html", "css", "js"],
      imageUrl: "/images/projects/jogo_da_memoria.png",
      linkUrl: "https://michellycruz.github.io/jogos-e-projetos/jogo_da_memoria/index.html",
      repoUrl: "https://github.com/michellycruz/jogos-e-projetos",
      private: false,
    },
    {
      title: "PetLife",
      year: "2023",
      description:
        "Site de clínica veterinária feito no início dos estudos: seções, navegação por âncora e responsividade escritas na mão, sem framework.",
      tech: ["html", "css", "js"],
      imageUrl: "/images/projects/petlife.png",
      linkUrl: "https://michellycruz.github.io/jogos-e-projetos/petlife/index.html",
      repoUrl: "https://github.com/michellycruz/jogos-e-projetos",
      private: false,
    },
    {
      title: "Calculadora",
      year: "2023",
      description:
        "Monta a expressão inteira antes de resolver — com parênteses e módulo —, copia o resultado e alterna entre tema claro e escuro.",
      tech: ["html", "css", "js"],
      imageUrl: "/images/projects/calculadora.png",
      linkUrl: "https://michellycruz.github.io/javascript-onebitcode/projetos/calculadora/index.html",
      repoUrl: "https://github.com/michellycruz/javascript-onebitcode",
      private: false,
    },
  ],
};
