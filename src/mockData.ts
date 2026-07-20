import { Agency, UserProfile, ContentItem, CreditTransaction, CreditPackage, SystemPrompt, ContentFormat, ContentStatus } from "./types";

// Default System Prompt
export const DEFAULT_SYSTEM_PROMPT: SystemPrompt = {
  id: "prompt-1",
  title: "Estrategista de Educação Internacional Pro v1.0",
  isActive: true,
  updatedAt: "2026-07-17",
  promptText: `Você é uma IA estrategista de marketing de conteúdo de elite, especializada em intercâmbio, consultorias de vistos, escolas de idiomas e educação internacional.
Sua missão é criar conteúdos altamente persuasivos, informativos e magnéticos para Instagram e TikTok que convertam leitores em leads qualificados.

INFORMAÇÕES GERAIS DA EMPRESA:
- Nome: {agencyName}
- Destinos de atuação: {destinations}
- Serviços oferecidos: {services}
- Público-alvo principal: {audience}
- Tom de voz: {tone}
- Diferenciais competitivos: {differentials}

DADOS DE CONTEXTO DO POST:
- Destino Selecionado: {selectedDestination}
- Serviço Selecionado: {selectedService}
- Tema/Dúvida do Cliente: {theme}
- Formato Solicitado: {format}
- Objetivo do Conteúdo: {objective}
- Etapa do Funil: {funnelStage}
- Contexto adicional do usuário: {customContext}

FORMATO DO RETORNO:
Você deve retornar OBRIGATORIAMENTE um objeto JSON com as seguintes chaves. Não escreva nenhuma palavra antes ou depois do JSON.
{
  "title": "Um título descritivo curto para este post no painel",
  "headlines": [
    "Headline 1 - Gancho forte para os primeiros 3 segundos",
    "Headline 2",
    "Headline 3",
    "Headline 4",
    "Headline 5",
    "Headline 6",
    "Headline 7",
    "Headline 8",
    "Headline 9",
    "Headline 10"
  ],
  "generatedText": "O texto completo do conteúdo estruturado conforme o formato. Se for Roteiro de Reels/TikTok, separe por Cenas, Falas e Indicações Visuais de forma criativa. Se for Carrossel, separe por Slide 1, Slide 2, etc., com textos curtos e focados em design. Se for Sequência de Stories, indique Story 1, Story 2, etc., com enquetes/box de perguntas e ganchos de interação. Se for Legenda, faça parágrafos espaçados, emojis e excelente storytelling.",
  "cta": "Um Call To Action (chamada para ação) altamente estratégico alinhado com o objetivo e a etapa do funil",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4"]
}`
};

// Default Credit Packages
export const DEFAULT_PACKAGES: CreditPackage[] = [
  {
    id: "pack-starter",
    name: "Plano Start",
    description: "Ideal para freelancers ou agências em início de jornada que querem testar o poder da IA.",
    creditsAmount: 30,
    price: 49.00,
    popular: false
  },
  {
    id: "pack-pro",
    name: "Plano Pro Creator",
    description: "Nosso plano mais popular. Créditos suficientes para manter um feed ativo o mês todo.",
    creditsAmount: 100,
    price: 119.00,
    popular: true
  },
  {
    id: "pack-enterprise",
    name: "Plano Agency Elite",
    description: "Desenvolvido para grandes agências de intercâmbio com múltiplos consultores e contas sociais.",
    creditsAmount: 300,
    price: 269.00,
    popular: false
  }
];

// Default Agency
const DEFAULT_AGENCY: Agency = {
  id: "agency-123",
  name: "Intercâmbio Sem Fronteiras",
  destinations: ["Canadá", "Irlanda", "Austrália", "Espanha", "Reino Unido"],
  services: ["Trabalho & Estudo", "Curso de Idiomas", "Consultoria de Vistos", "High School", "College & Universidade"],
  audience: "Jovens de 18 a 35 anos que buscam crescimento na carreira, transição profissional ou independência no exterior.",
  tone: "Informal, inspirador, confiável e focado em conquistas práticas e desmistificação do processo.",
  differentials: "Suporte local no destino, consultores que já viveram a experiência, assessoria de vistos integrada com 98% de aprovação.",
  createdAt: "2026-05-10"
};

// Default User (Simulated Account)
const DEFAULT_USER: UserProfile = {
  id: "user-456",
  email: "admin@globoai.com",
  fullName: "Carlos Eduardo (Admin)",
  agencyId: "agency-123",
  role: "admin", // Let's make it admin so the user can see everything, including Admin Panel!
  availableCredits: 4,
  totalGenerated: 24,
  totalPublished: 12,
  createdAt: "2026-05-10"
};

// Default Contents
const DEFAULT_CONTENTS: ContentItem[] = [
  {
    id: "post-1",
    agencyId: "agency-123",
    creatorId: "user-456",
    title: "Mitos sobre trabalhar no Canadá",
    destination: "Canadá",
    service: "Trabalho & Estudo",
    theme: "Dúvida: preciso de inglês fluente para conseguir o primeiro emprego no Canadá?",
    format: ContentFormat.REELS_SCRIPT,
    objective: "Quebrar Objeções",
    funnelStage: "Meio de Funil",
    customContext: "Focar em posições de entrada e como o inglês melhora no dia a dia.",
    generatedText: `**Roteiro para Reels/TikTok: Mitos sobre trabalhar no Canadá**

[Cena 1: Foco no rosto do criador, com uma expressão pensativa. Legenda na tela: "Eu preciso de inglês fluente pra trabalhar no Canadá?"]
**Fala (Início rápido):** "Você acha que só quem fala inglês perfeito consegue emprego no Canadá? Spoiler: Isso é mentira e eu vou te provar!"

[Cena 2: Corta para imagens rápidas de cafés, lojas e escritórios de Vancouver/Toronto]
**Fala:** "A verdade é que existem milhares de vagas na área de serviços onde o inglês intermediário é mais do que suficiente para começar. Posições como barista, estoquista ou auxiliar administrativo valorizam a sua força de vontade!"

[Cena 3: Aponta para a tela onde surgem tópicos animados]
**Fala:** "Três coisas acontecem quando você vai com inglês intermediário:
Primeiro, o mercado canadense é extremamente acolhedor com imigrantes.
Segundo, seu inglês evolui 10 vezes mais rápido praticando no trabalho real.
E terceiro, as agências ajudam você a preparar um currículo perfeito pro mercado local."

[Cena 4: Criador sorrindo, segurando uma caneca ou passaporte]
**Fala:** "O maior erro é esperar a fluência mágica no Brasil, em vez de viver a imersão onde ela realmente acontece!"`,
    headlines: [
      "Precisa de inglês fluente pra trabalhar no Canadá?",
      "O maior mito sobre o mercado canadense revelado!",
      "Inglês intermediário trabalha no Canadá? Descubra",
      "Como conseguir emprego no Canadá sem falar fluente",
      "Pare de adiar o Canadá por causa do inglês",
      "A verdade nua e crua sobre empregos no Canadá",
      "Como seu inglês evolui 10x mais rápido trabalhando no exterior",
      "Dica de ouro para o seu currículo canadense",
      "Qual nível de inglês as empresas canadenses realmente pedem?",
      "Intercâmbio de Trabalho e Estudo: O guia prático"
    ],
    cta: "Comente 'CANADÁ' aqui embaixo que eu vou te enviar o guia gratuito do programa de Trabalho e Estudo!",
    hashtags: ["intercambiocanada", "trabalharnocanada", "estudarnocanada", "vidadeintercambista"],
    status: ContentStatus.SCHEDULED,
    scheduledDate: "2026-07-18",
    createdAt: "2026-07-15"
  },
  {
    id: "post-2",
    agencyId: "agency-123",
    creatorId: "user-456",
    title: "Custo de Vida na Irlanda 2026",
    destination: "Irlanda",
    service: "Curso de Idiomas",
    theme: "Qual o valor real do mercado e aluguel em Dublin hoje?",
    format: ContentFormat.CAROUSEL,
    objective: "Informativo/Educacional",
    funnelStage: "Topo de Funil",
    customContext: "Trazer dados realistas, mas sem assustar. Mostrar dicas de economia (comprar em mercados de atacado, morar fora do centro).",
    generatedText: `**Carrossel de Imagens: Quanto custa viver em Dublin? 🇮🇪**

**Slide 1: Capa Impactante**
- *Visual:* Imagem de Dublin à noite com texto grande.
- *Texto:* O custo REAL de viver em Dublin em 2026. Quanto você realmente precisa? Descubra a seguir. 👉

**Slide 2: A Maior Despesa (Acomodação)**
- *Visual:* Quarto compartilhado minimalista e aconchegante.
- *Texto:* Aluguel em Dublin varia de €400 a €650 para vagas compartilhadas. Dica de ouro: busque acomodações em bairros como Dublin 6, 7 ou 8, ou cidades vizinhas conectadas pelo DART!

**Slide 3: Alimentação e Supermercado**
- *Visual:* Carrinho de compras com marcas populares locais (Tesco, Lidl, Aldi).
- *Texto:* Supermercado é muito barato! Gastando cerca de €150 a €200 por mês você come muito bem fazendo suas próprias refeições. Dica: as marcas próprias dos mercados alemães salvam vidas!

**Slide 4: Transporte e Lazer**
- *Visual:* Estudante usando o Leap Card no ônibus de dois andares verde.
- *Texto:* Estudante tem tarifas reduzidas de transporte com o Leap Card. Para lazer, Dublin tem parques incríveis e museus gratuitos. Reserve €100/mês para aquela Guinness no Pub!

**Slide 5: Equilibrando as contas (Salário Mínimo)**
- *Visual:* Gráfico simples de Pizza mostrando Receita vs Despesa.
- *Texto:* Com o salário mínimo na Irlanda (€13.50/hora), trabalhando 20h por semana você ganha cerca de €1.080 por mês. Dá pra pagar todas as despesas básicas e ainda guardar para viajar pela Europa!`,
    headlines: [
      "Quanto custa morar em Dublin em 2026?",
      "Custo de vida na Irlanda: Dá pra se manter?",
      "O segredo para economizar no aluguel em Dublin",
      "Fazer compras na Irlanda: Quanto gastei no mês?",
      "Dá para viver com salário mínimo de estudante na Irlanda?",
      "Guia realista de gastos em Dublin",
      "Morar na Irlanda em 2026: Planejamento financeiro",
      "Lidl vs Tesco: Onde o intercambista economiza mais?",
      "Leap Card: O melhor amigo do intercambista em Dublin",
      "Como viajar pela Europa morando na Irlanda"
    ],
    cta: "Salve este post para consultar quando estiver montando seu planejamento financeiro para a Irlanda!",
    hashtags: ["intercambioirlanda", "custodevidadublin", "estudarfora", "morarnaeuropa"],
    status: ContentStatus.APPROVED,
    scheduledDate: "2026-07-20",
    createdAt: "2026-07-16"
  },
  {
    id: "post-3",
    agencyId: "agency-123",
    creatorId: "user-456",
    title: "Visto Austrália: Passo a Passo",
    destination: "Austrália",
    service: "Consultoria de Vistos",
    theme: "Documentação essencial e comprovação financeira sem erros.",
    format: ContentFormat.CAPTIONS,
    objective: "Autoridade/Venda",
    funnelStage: "Fundo de Funil",
    customContext: "Mostrar a facilidade do processo se feito com uma consultoria séria.",
    generatedText: `**Legenda Completa para Redes Sociais: Austrália sem medo! 🇦🇺**

Você sabia que a maior causa de vistos negados para a Austrália é o preenchimento incorreto de dados ou a comprovação financeira incompleta? 

Sim, o sonho de morar pertinho da praia e viver em um país com uma das melhores qualidades de vida do mundo pode esbarrar em burocracia desnecessária. Mas não precisa ser assim! 

Aqui na {agencyName}, nós dividimos o processo do seu visto australiano em 4 fases à prova de falhas:

1️⃣ **Análise de Perfil:** Avaliamos suas qualificações para escolher o melhor curso e região da Austrália que se alinhem aos seus objetivos futuros de carreira.
2️⃣ **Montagem da GTE (Genuine Temporary Entrant):** A carta de intenção é o coração do seu visto. Redigimos juntos de forma estratégica, provando os seus laços com o Brasil e objetivos reais.
3️⃣ **Checklist Financeiro:** Organizamos os extratos e imposto de renda detalhadamente para que a imigração não tenha NENHUMA dúvida sobre a sua capacidade financeira de se manter no país.
4️⃣ **Protocolo e Acompanhamento:** Protocolamos o visto e acompanhamos todas as atualizações até a aprovação.

Não arrisque seu investimento de uma vida inteira tentando fazer tudo sozinho. Conte com quem tem 98% de aprovação e suporte especializado de cabo a rabo!`,
    headlines: [
      "Evite a negação: Como conseguir o visto australiano",
      "Austrália em 2026: Passo a passo do visto de estudante",
      "Como comprovar a renda para a Austrália sem erros",
      "O segredo da GTE perfeita para o visto australiano",
      "Por que vistos para a Austrália são negados?",
      "Documentos obrigatórios para o seu intercâmbio na Austrália",
      "Planejando a Austrália? Comece por este guia de vistos",
      "Diferença entre visto aprovado e negado está aqui",
      "Como aprovar o visto australiano de primeira",
      "Imigração Austrália: O que eles realmente analisam"
    ],
    cta: "Quer saber se seu perfil está pronto para a Austrália? Clique no link da bio e agende uma simulação de visto gratuita hoje!",
    hashtags: ["vistoaustralia", "intercambioaustralia", "estudarnaustralia", "partiuaustralia"],
    status: ContentStatus.PUBLISHED,
    scheduledDate: "2026-07-14",
    createdAt: "2026-07-10"
  }
];

// Default Credit Transactions
const DEFAULT_TRANSACTIONS: CreditTransaction[] = [
  {
    id: "tx-1",
    profileId: "user-456",
    date: "2026-05-10 10:00",
    amount: 10,
    type: "bonus",
    description: "Crédito bônus de boas-vindas do sistema"
  },
  {
    id: "tx-2",
    profileId: "user-456",
    date: "2026-06-15 14:30",
    amount: 30,
    type: "purchase",
    description: "Compra de Pacote Start",
    pricePaid: 49.00
  },
  {
    id: "tx-3",
    profileId: "user-456",
    date: "2026-07-15 11:20",
    amount: -1,
    type: "generation",
    description: "Geração de Conteúdo: Roteiro Reels Canadá"
  },
  {
    id: "tx-4",
    profileId: "user-456",
    date: "2026-07-16 15:45",
    amount: -1,
    type: "generation",
    description: "Geração de Conteúdo: Carrossel Dublin"
  },
  {
    id: "tx-5",
    profileId: "user-456",
    date: "2026-07-17 09:12",
    amount: -2,
    type: "generation",
    description: "Geração de Conteúdo: Redes Sociais Austrália (Headlines)"
  }
];

// Initialize localStorage if not present
export const initializeDB = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("globoai_agency")) {
    localStorage.setItem("globoai_agency", JSON.stringify(DEFAULT_AGENCY));
  }
  if (!localStorage.getItem("globoai_user")) {
    localStorage.setItem("globoai_user", JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem("globoai_contents")) {
    localStorage.setItem("globoai_contents", JSON.stringify(DEFAULT_CONTENTS));
  }
  if (!localStorage.getItem("globoai_transactions")) {
    localStorage.setItem("globoai_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
  }
  if (!localStorage.getItem("globoai_system_prompt")) {
    localStorage.setItem("globoai_system_prompt", JSON.stringify(DEFAULT_SYSTEM_PROMPT));
  }
  if (!localStorage.getItem("globoai_packages")) {
    localStorage.setItem("globoai_packages", JSON.stringify(DEFAULT_PACKAGES));
  }
  if (!localStorage.getItem("globoai_all_users")) {
    // For admin user management
    const users = [
      DEFAULT_USER,
      {
        id: "user-user1",
        email: "user@globoai.com",
        fullName: "Mariana Costa (User)",
        agencyId: "agency-123",
        role: "user",
        availableCredits: 4,
        totalGenerated: 12,
        totalPublished: 4,
        createdAt: "2026-06-01"
      },
      {
        id: "user-user2",
        email: "engenhariasubversaoriginal@gmail.com",
        fullName: "Carlos Eduardo (Engenharia)",
        agencyId: "agency-123",
        role: "admin",
        availableCredits: 4,
        totalGenerated: 24,
        totalPublished: 12,
        createdAt: "2026-05-10"
      },
      {
        id: "user-888",
        email: "thiago.consultoria@vistos.com.br",
        fullName: "Thiago Mendes",
        agencyId: "agency-123",
        role: "user",
        availableCredits: 4,
        totalGenerated: 80,
        totalPublished: 55,
        createdAt: "2026-04-12"
      }
    ];
    localStorage.setItem("globoai_all_users", JSON.stringify(users));
  }
  if (!localStorage.getItem("globoai_all_agencies")) {
    const agencies = [
      DEFAULT_AGENCY,
      {
        id: "agency-999",
        name: "Mundo Idiomas & Vistos",
        destinations: ["EUA", "Reino Unido", "Malta", "Irlanda"],
        services: ["Curso de Idiomas", "Preparatório IELT/TOEFL", "Visto de Estudante"],
        audience: "Estudantes universitários e adultos com foco em imersão linguística rápida.",
        tone: "Prático, dinâmico e acadêmico.",
        differentials: "Professores nativos e garantia de reembolso parcial se visto for negado.",
        createdAt: "2026-06-01"
      }
    ];
    localStorage.setItem("globoai_all_agencies", JSON.stringify(agencies));
  }
};

// State fetching/updating helpers
export const getAgency = (): Agency => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_agency") || "{}");
};

export const saveAgency = (agency: Agency) => {
  localStorage.setItem("globoai_agency", JSON.stringify(agency));
  // Keep active list updated as well
  const allAgencies = getAllAgencies();
  const index = allAgencies.findIndex(a => a.id === agency.id);
  if (index !== -1) {
    allAgencies[index] = agency;
    localStorage.setItem("globoai_all_agencies", JSON.stringify(allAgencies));
  }
};

export const getUserProfile = (): UserProfile => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_user") || "{}");
};

export const saveUserProfile = (user: UserProfile) => {
  localStorage.setItem("globoai_user", JSON.stringify(user));
  // Keep list updated
  const allUsers = getAllUsers();
  const index = allUsers.findIndex(u => u.id === user.id);
  if (index !== -1) {
    allUsers[index] = user;
    localStorage.setItem("globoai_all_users", JSON.stringify(allUsers));
  }
};

export const getContents = (): ContentItem[] => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_contents") || "[]");
};

export const saveContents = (contents: ContentItem[]) => {
  localStorage.setItem("globoai_contents", JSON.stringify(contents));
};

export const getTransactions = (): CreditTransaction[] => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_transactions") || "[]");
};

export const saveTransactions = (transactions: CreditTransaction[]) => {
  localStorage.setItem("globoai_transactions", JSON.stringify(transactions));
};

export const getSystemPrompt = (): SystemPrompt => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_system_prompt") || "{}");
};

export const saveSystemPrompt = (prompt: SystemPrompt) => {
  localStorage.setItem("globoai_system_prompt", JSON.stringify(prompt));
};

export const getPackages = (): CreditPackage[] => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_packages") || "[]");
};

export const savePackages = (packages: CreditPackage[]) => {
  localStorage.setItem("globoai_packages", JSON.stringify(packages));
};

export const getAllUsers = (): UserProfile[] => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_all_users") || "[]");
};

export const saveAllUsers = (users: UserProfile[]) => {
  localStorage.setItem("globoai_all_users", JSON.stringify(users));
};

export const getAllAgencies = (): Agency[] => {
  initializeDB();
  return JSON.parse(localStorage.getItem("globoai_all_agencies") || "[]");
};

export const saveAllAgencies = (agencies: Agency[]) => {
  localStorage.setItem("globoai_all_agencies", JSON.stringify(agencies));
};

export const resetDatabase = () => {
  localStorage.removeItem("globoai_agency");
  localStorage.removeItem("globoai_user");
  localStorage.removeItem("globoai_contents");
  localStorage.removeItem("globoai_transactions");
  localStorage.removeItem("globoai_system_prompt");
  localStorage.removeItem("globoai_packages");
  localStorage.removeItem("globoai_all_users");
  localStorage.removeItem("globoai_all_agencies");
  initializeDB();
};
