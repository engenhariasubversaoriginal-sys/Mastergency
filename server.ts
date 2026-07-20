import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave GEMINI_API_KEY não foi configurada. Acesse as Configurações > Segredos no AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function isApiKeyConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return !!apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";
}

function generateFallbackContent(body: any) {
  const {
    agency,
    selectedDestination,
    selectedService,
    theme,
    format,
    objective,
    funnelStage,
    customContext
  } = body;

  const agencyName = agency?.name || "Nossa Agência";
  const dest = selectedDestination || "Canadá";
  const serv = selectedService || "Trabalho & Estudo";
  const cleanTheme = theme || "Planejamento de Intercâmbio";

  // Create highly customized hooks
  const headlines = [
    `Como fazer seu intercâmbio de ${serv} para ${dest} em 2026!`,
    `A verdade revelada sobre ${cleanTheme} que ninguém te conta.`,
    `Por que 90% das pessoas erram ao planejar ${serv} para ${dest}?`,
    `O guia definitivo sobre ${cleanTheme} (Salve para não perder!)`,
    `Seu sonho de viver em ${dest} está mais perto do que você imagina.`,
    `Quanto custa de verdade fazer ${serv} em ${dest}?`,
    `3 coisas que você precisa saber antes de fechar seu intercâmbio.`,
    `Como a ${agencyName} ajuda você a conquistar seu visto para ${dest}!`,
    `O segredo para economizar no planejamento de ${serv}.`,
    `A melhor decisão para a sua carreira internacional em 2026.`
  ];

  let generatedText = "";
  let cta = "";
  let hashtags = [
    `intercambio${dest.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")}`,
    `${serv.toLowerCase().replace(/[^a-zA-Z0-9]/g, "").substring(0, 15)}`,
    "globoai",
    "estudarfora",
    "vidadeintercambista"
  ];

  if (format === "Roteiro de Reels/TikTok") {
    generatedText = `**Roteiro de Reels/TikTok 🎬**

[Cena 1: Gancho Rápido - Foco no apresentador sorrindo e apontando para um mapa de ${dest}]
**Apresentador:** "Você sabia que é possível realizar o sonho de ${cleanTheme} sem complicações? E sim, ${dest} é o lugar perfeito para isso!"

[Cena 2: O Problema - Imagens rápidas de malas e aeroporto]
**Apresentador:** "Muitos acham que o processo de ${serv} é super difícil e burocrático. Mas a verdade é que, com o planejamento certo, você economiza tempo e evita erros que custam caro!"

[Cena 3: A Solução - Mostra o logo ou site da ${agencyName}]
**Apresentador:** "Na ${agencyName}, nós cuidamos de toda a assessoria de visto, escolha do curso ideal e suporte local para você viajar com 100% de segurança!"

[Cena 4: Call to Action]
**Apresentador:** "Não espere o ano acabar para tomar a decisão que vai mudar a sua carreira. O momento de começar é agora!"`;
    
    cta = `Gostou dessa dica? Comente "${dest.toUpperCase()}" aqui embaixo e receba um diagnóstico de perfil gratuito na sua DM!`;
  } else if (format === "Carrossel de Imagens") {
    generatedText = `**Roteiro de Carrossel de Imagens 📄**

**Slide 1: Capa Impactante**
- *Visual:* Foto elegante de ${dest} com um título em destaque.
- *Texto:* O Guia Definitivo sobre ${cleanTheme}! O que ninguém te conta sobre fazer ${serv} em ${dest}. 👉

**Slide 2: O Primeiro Passo**
- *Visual:* Alguém organizando documentos em uma mesa de trabalho.
- *Texto:* Tudo começa com a escolha inteligente do seu programa de ${serv}. Isso define as regras do seu visto e sua permissão de trabalho!

**Slide 3: O Planejamento Financeiro**
- *Visual:* Um café aconchegante em ${dest} com uma planilha aberta no laptop.
- *Texto:* Além do curso, você precisa comprovar os fundos para se manter. Na ${agencyName}, organizamos sua pasta financeira à prova de negações!

**Slide 4: O Diferencial que Importa**
- *Visual:* Equipe sorridente dando as boas-vindas.
- *Texto:* Viajar com a ${agencyName} significa ter suporte personalizado e consultores que já viveram a mesma experiência que você vai viver!`;

    cta = `Arraste para o lado se você curtiu e salve este post para consultar durante seu planejamento financeiro!`;
  } else if (format === "Sequência de Stories") {
    generatedText = `**Sequência de Stories para Engajamento 📲**

**Story 1: Pergunta Interativa**
- *Visual:* Foto de um lindo nascer do sol em ${dest}.
- *Interação:* Enquete ou Box de Pergunta: "Qual seu maior medo ao planejar ${cleanTheme}?"
- *Texto:* Quem aqui sonha em fazer ${serv} em ${dest}, mas se perde no meio de tanta informação na internet? 👇

**Story 2: Desmistificando**
- *Visual:* Print de uma dúvida comum sobre vistos de ${dest}.
- *Texto:* A maioria acha que precisa de fortunas ou inglês fluente imediato. Mito! O processo é muito mais acessível do que parece se feito com a assessoria certa.

**Story 3: Nosso Suporte**
- *Visual:* Foto real ou vídeo de um intercambista nosso que já está em ${dest} trabalhando!
- *Texto:* É por isso que nossos alunos da ${agencyName} viajam tranquilos. Cuidamos de cada detalhe, do zero até o suporte de chegada no destino.

**Story 4: Chamada Direta**
- *Visual:* Link sticker para o WhatsApp.
- *Texto:* Restam poucas vagas com as tarifas promocionais deste mês. Toque no link e fale agora com um especialista! 🚀`;

    cta = `Toque no sticker de link acima e agende sua consultoria personalizada e gratuita com a equipe da ${agencyName}!`;
  } else {
    // Legenda Completa
    generatedText = `**Legenda Completa para Redes Sociais 📝**

Você ainda tem dúvidas sobre como funciona **${cleanTheme}**? 🤔

Fazer um intercâmbio de **${serv}** em **${dest}** é o sonho de milhares de brasileiros que buscam crescimento na carreira, transição profissional ou simplesmente uma nova experiência de vida no exterior.

Mas sabemos que surgem muitas dúvidas no caminho:
• Qual a documentação correta para o visto?
• Quanto preciso comprovar financeiramente?
• Como conseguir o primeiro emprego no destino?

A boa notícia é que você não precisa passar por essa jornada sozinho. Aqui na **${agencyName}**, nossa equipe de especialistas acompanha você em cada etapa: da escolha da escola ideal ao protocolo do seu visto com a máxima taxa de aprovação do mercado! 🚀

Tudo formatado sob medida para o seu perfil e objetivos de vida.`;

    cta = `Ficou interessado? Clique no link da nossa bio ou mande uma mensagem direta no nosso direct para bater um papo sem compromisso com nossos consultores especialistas!`;
  }

  // Generate a clean title
  const words = cleanTheme.split(" ").filter(w => w.length > 3);
  const keyword = words[0] || "Intercâmbio";
  const title = `Guia de ${keyword} para ${dest}`;

  return {
    title: `[DEMO] ${title}`,
    headlines,
    generatedText,
    cta,
    hashtags,
    isDemo: true
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API endpoint for AI Content Generation
  app.post("/api/generate", async (req, res) => {
    try {
      const {
        agency,
        selectedDestination,
        selectedService,
        theme,
        format,
        objective,
        funnelStage,
        customContext,
        systemPromptText
      } = req.body;

      if (!agency || !theme || !format) {
        return res.status(400).json({
          error: "Dados incompletos para a geração.",
          details: "Agência, tema e formato são obrigatórios."
        });
      }

      // Check if API key is configured. If not, use fallback generation.
      if (!isApiKeyConfigured()) {
        console.log("GEMINI_API_KEY is not configured. Running in Demo/Fallback Mode.");
        const fallbackResponse = generateFallbackContent(req.body);
        return res.json(fallbackResponse);
      }

      // Compile prompt by substituting placehoders
      let compiledPrompt = systemPromptText || "";
      
      const replacements: Record<string, string> = {
        "{agencyName}": agency.name || "Nossa Agência",
        "{destinations}": (agency.destinations || []).join(", ") || "Todos os destinos",
        "{services}": (agency.services || []).join(", ") || "Cursos de idioma, vistos e intercâmbio",
        "{audience}": agency.audience || "Jovens e profissionais querendo estudar e trabalhar no exterior",
        "{tone}": agency.tone || "Amigável, inspirador e profissional",
        "{differentials}": agency.differentials || "Atendimento personalizado e suporte integrado",
        "{selectedDestination}": selectedDestination || "Geral / Multi-destino",
        "{selectedService}": selectedService || "Intercâmbio geral",
        "{theme}": theme,
        "{format}": format,
        "{objective}": objective || "Engajamento",
        "{funnelStage}": funnelStage || "Meio de Funil",
        "{customContext}": customContext || "Sem contexto adicional"
      };

      for (const [key, value] of Object.entries(replacements)) {
        compiledPrompt = compiledPrompt.replace(new RegExp(key, "g"), value);
      }

      // Initialize AI Client
      const ai = getAiClient();

      const userMessage = `Crie o conteúdo de marketing conforme as diretrizes passadas. Tema do post: "${theme}". Formato: "${format}".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userMessage,
        config: {
          systemInstruction: compiledPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Título curto de 3 a 5 palavras para identificar este post na biblioteca.",
              },
              headlines: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exatamente 10 headlines, ganchos ou títulos atraentes para redes sociais.",
              },
              generatedText: {
                type: Type.STRING,
                description: "O texto/roteiro estruturado do conteúdo final em markdown formatado de forma limpa e profissional.",
              },
              cta: {
                type: Type.STRING,
                description: "Call to Action persuasivo e focado no objetivo de conversão.",
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 a 6 hashtags estratégicas e relevantes.",
              },
            },
            required: ["title", "headlines", "generatedText", "cta", "hashtags"],
          },
          temperature: 0.85,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("A IA retornou um conteúdo vazio.");
      }

      const generatedData = JSON.parse(responseText.trim());
      res.json(generatedData);
    } catch (err: any) {
      console.error("Erro na geração do Gemini:", err);
      res.status(500).json({
        error: "Falha na geração com Inteligência Artificial.",
        details: err.message || "Erro desconhecido"
      });
    }
  });

  // API endpoint for conversational ChatGPT-style chat strategist
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, agency } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "O prompt é obrigatório." });
      }

      const agencyName = agency?.name || "Nossa Agência de Intercâmbio";

      // If API Key is not set, provide a brilliant fallback chat response
      if (!isApiKeyConfigured()) {
        console.log("GEMINI_API_KEY is not configured. /api/chat running in Fallback Mode.");
        
        let responseText = "";
        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes("cta") || lowerPrompt.includes("chamada") || lowerPrompt.includes("conversão")) {
          responseText = `### 🚀 Fórmulas de Chamada para Ação (CTA) de Alta Conversão para **${agencyName}**

Aqui estão 3 opções de alta conversão prontas para uso em suas redes sociais baseadas na sua solicitação:

1. **CTA com Escassez Imersiva (Ideal para Stories):**
   > *"🚨 As tarifas promocionais com desconto para este destino encerram nesta sexta-feira. Toque no sticker de link e garanta sua simulação de orçamento gratuita agora!"*

2. **CTA com Entrega de Isca Digital (Ideal para Reels):**
   > *"Quer saber o checklist completo de documentos exigidos pela imigração? Comente **'VISTO'** aqui embaixo que eu te envio o guia passo a passo em menos de 1 minuto no seu Direct!"*

3. **CTA com Foco em Autoridade (Ideal para posts informativos/Carrossel):**
   > *"Não arrisque o investimento de uma vida inteira com erros burocráticos bobos. Fale hoje com nossos especialistas certificados e tenha assessoria de ponta a ponta. Link na bio!"*

*Dica: Altere o tom de acordo com seu público-alvo principal (estudantes jovens ou profissionais mais velhos)!*`;
        } else if (lowerPrompt.includes("reels") || lowerPrompt.includes("tiktok") || lowerPrompt.includes("video") || lowerPrompt.includes("idéias")) {
          responseText = `### 🎬 Ideias Estratégicas de Reels de Alto Impacto para **${agencyName}**

Aqui estão 3 ganchos (Hooks) magnéticos para os primeiros 3 segundos do seu vídeo, projetados para reter a atenção de futuros intercambistas:

1. **Gancho de Curiosidade / Contraintuitivo:**
   * **Visual:** Você com cara de mistério apontando para a tela com legenda: *"Não feche seu intercâmbio de Trabalho e Estudo antes de saber disso."*
   * **Legenda/Roteiro:** Quebre o mito de que precisa de inglês fluente para começar a trabalhar. Mostre que o nível intermediário já abre portas incríveis em vagas de serviços!

2. **Gancho de Alívio / Solução:**
   * **Visual:** Você segurando um passaporte rindo e dançando com legenda: *"Como eu comprovei renda pro visto estudantil sem ter uma fortuna na conta."*
   * **Legenda/Roteiro:** Explique de forma prática o uso do patrocinador financeiro (Sponsor) familiar autorizado pelos consulados de destinos populares.

3. **Gancho de Economia / Alerta:**
   * **Visual:** Expressão séria com legenda: *"O maior erro que faz as pessoas perderem milhares de euros/dólares no intercâmbio."*
   * **Legenda/Roteiro:** Mostre a importância de escolher um suporte local para evitar golpes de acomodação antes de chegar ao destino.`;
        } else {
          responseText = `### 💡 Resposta do Consultor GloboAI para a Agência **${agencyName}**

Obrigado pelo seu prompt! Como estou operando em **Modo de Demonstração**, aqui está um conselho estratégico valioso de marketing de conteúdo internacional para a sua dúvida:

* **Sua pergunta:** *"${prompt}"*

**🏆 Estratégia Recomendada:**
1. **Foque na dor real do aluno:** O cliente de intercâmbio não compra o curso ou a agência, ele compra o *estilo de vida* e a *segurança* de que dará tudo certo no exterior.
2. **Entregue valor em todas as fases do funil:**
   - **Topo:** Mitos e Verdades, fotos inspiradoras, custos gerais.
   - **Meio:** Tutoriais de aplicação de vistos, comprovação de renda necessária, vagas de emprego disponíveis.
   - **Fundo:** Depoimentos reais de intercambistas da sua agência e facilidades de parcelamento exclusivas.

*Para respostas personalizadas em tempo real via Inteligência Artificial Gemini, configure a chave \`GEMINI_API_KEY\` nas Configurações do seu Painel do AI Studio.*`;
        }

        return res.json({ response: responseText, isDemo: true });
      }

      // If API key is present, execute a real Gemini prompt
      const ai = getAiClient();
      const systemInstruction = `Você é um Consultor Estrategista de Marketing de Elite focado em Agências de Intercâmbio, visto e educação internacional.
Sua missão é responder à dúvida do usuário com extrema precisão, dando ideias práticas de posts, chamadas para ação (CTAs), ganchos (Hooks) para vídeos curtos (TikTok/Reels), estratégias de storytelling ou textos persuasivos prontos para copiar.
Retorne sua resposta formatada com markdown elegante, títulos claros, listas legíveis e blocos de código com ganchos ou CTAs quando necessário.
Dados da agência parceira do usuário:
- Nome da Agência: ${agencyName}
- Destinos de atuação: ${(agency?.destinations || []).join(", ") || "Canadá, Irlanda, Austrália"}
- Serviços oferecidos: ${(agency?.services || []).join(", ") || "Trabalho & Estudo, Cursos de Idiomas, Vistos"}
- Tom de voz preferido: ${agency?.tone || "Amigável e inspirador"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.85,
        }
      });

      res.json({ response: response.text || "Sem resposta da IA.", isDemo: false });
    } catch (err: any) {
      console.error("Erro no chat do Gemini:", err);
      res.status(500).json({
        error: "Falha na resposta do consultor de IA.",
        details: err.message || "Erro desconhecido"
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
