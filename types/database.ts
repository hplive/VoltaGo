export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type TipoConta = 'condominio' | 'restaurante' | 'casa'
export type EstadoConta = 'ativa' | 'espera' | 'suspensa' | 'inativa'
export type EstadoZona = 'ativa' | 'planeada' | 'inativa'
export type Material = 'plastico' | 'lata' | 'vidro' | 'outro'

export interface Database {
  public: {
    Tables: {
      zonas: {
        Row: { id: string; nome: string; concelho: string; estado: EstadoZona; created_at: string }
        Insert: Omit<Database['public']['Tables']['zonas']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['zonas']['Insert']>
      }
      bairros: {
        Row: { id: string; zona_id: string; nome: string; casas_aderentes: number; limiar_promocao: number; tem_rota: boolean; created_at: string }
        Insert: Omit<Database['public']['Tables']['bairros']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['bairros']['Insert']>
      }
      contas: {
        Row: { id: string; zona_id: string; bairro_id: string | null; tipo: TipoConta; nome: string; nif: string | null; estado: EstadoConta; num_fracoes: number | null; nome_gestor: string | null; morada: string | null; cidade: string; codigo_postal: string | null; lat: number | null; lng: number | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['contas']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['contas']['Insert']>
      }
      conta_utilizadores: {
        Row: { id: string; conta_id: string; user_id: string; papel: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['conta_utilizadores']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['conta_utilizadores']['Insert']>
      }
      carteiras: {
        Row: { id: string; conta_id: string; saldo: number; tipo: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['carteiras']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['carteiras']['Insert']>
      }
      transacoes: {
        Row: { id: string; carteira_id: string; tipo: string; valor: number; descricao: string | null; recolha_id: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['transacoes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['transacoes']['Insert']>
      }
      recolhas: {
        Row: { id: string; paragem_id: string; motorista_id: string | null; momento: string; total_embalagens: number; confirmada: boolean; created_at: string }
        Insert: Omit<Database['public']['Tables']['recolhas']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['recolhas']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
