import { createClient } from "@supabase/supabase-js";

// Lazy initialize Supabase to prevent startup crashes if keys are not present
const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    supabaseUrl !== "YOUR_SUPABASE_URL" &&
    !!supabaseAnonKey &&
    supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY"
  );
};

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Erro ao inicializar cliente Supabase:", error);
    return null;
  }
};

// SQL Schema for users to create tables in Supabase:
export const SUPABASE_SETUP_SQL = `-- Executar no SQL Editor do Supabase para criar as tabelas do GloboAI:

-- 1. Tabela de Agências
CREATE TABLE IF NOT EXISTS public.agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  destinations TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  audience TEXT,
  tone TEXT,
  differentials TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Perfis de Usuário
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  agency_id TEXT REFERENCES public.agencies(id) ON DELETE SET NULL,
  role TEXT DEFAULT 'user' NOT NULL,
  available_credits INTEGER DEFAULT 4 NOT NULL,
  total_generated INTEGER DEFAULT 0 NOT NULL,
  total_published INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) opcionalmente
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público simples para demonstração
CREATE POLICY "Acesso público total para agências" ON public.agencies FOR ALL USING (true);
CREATE POLICY "Acesso público total para perfis" ON public.user_profiles FOR ALL USING (true);
`;
