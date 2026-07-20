export enum ContentFormat {
  REELS_SCRIPT = "Roteiro de Reels/TikTok",
  CAROUSEL = "Carrossel de Imagens",
  STORIES = "Sequência de Stories",
  CAPTIONS = "Legenda Completa",
}

export enum ContentStatus {
  DRAFT = "Rascunho",
  APPROVED = "Aprovado",
  SCHEDULED = "Agendado",
  PUBLISHED = "Publicado",
}

export interface Agency {
  id: string;
  name: string;
  destinations: string[]; // e.g. ["Canadá", "Irlanda", "Austrália", "EUA"]
  services: string[];     // e.g. ["Cursos de Idiomas", "Trabalho & Estudo", "Consultoria de Visto", "Graduação/College"]
  audience: string;       // e.g. "Jovens profissionais de 22 a 32 anos querendo imigrar ou mudar de carreira"
  tone: string;           // e.g. "Entusiasmado, profissional, informativo, com gatilhos de urgência"
  differentials: string;  // e.g. "Suporte local 24/7, parcelamento próprio, consultores ex-intercambistas"
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  agencyId: string;
  role: "admin" | "user";
  availableCredits: number;
  totalGenerated: number;
  totalPublished: number;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  agencyId: string;
  creatorId: string;
  title: string;
  destination: string;
  service: string;
  theme: string;
  format: ContentFormat;
  objective: string;      // e.g. "Engajamento", "Captação de Leads", "Vendas Direct"
  funnelStage: string;    // e.g. "Topo de Funil", "Meio de Funil", "Fundo de Funil"
  customContext: string;
  generatedText: string;  // Main body text/script/carousel slides
  headlines: string[];    // Array of 10 headlines
  cta: string;            // Call to Action
  hashtags: string[];
  status: ContentStatus;
  scheduledDate?: string; // YYYY-MM-DD
  isDemo?: boolean;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  profileId: string;
  date: string;
  amount: number;         // Positive for purchase/bonus, negative for consumption
  type: "generation" | "purchase" | "bonus" | "refund";
  description: string;
  pricePaid?: number;     // in BRL, e.g. 49.90
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  creditsAmount: number;
  price: number;          // in BRL
  popular?: boolean;
}

export interface SystemPrompt {
  id: string;
  title: string;
  promptText: string;
  isActive: boolean;
  updatedAt: string;
}
