export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      offer_clicks: {
        Row: {
          id: string
          user_id: string
          offer_title: string
          offer_type: string
          reward: number
          clicked_at: string
          completed_at: string | null
          original_link: string
          status: string
          created_at: string
          updated_at: string
          device_info: Json
          completion_time: string | null
          category: string | null
          points: number
        }
        Insert: {
          id?: string
          user_id: string
          offer_title: string
          offer_type: string
          reward: number
          clicked_at?: string
          completed_at?: string | null
          original_link: string
          status?: string
          created_at?: string
          updated_at?: string
          device_info?: Json
          completion_time?: string | null
          category?: string | null
          points?: number
        }
        Update: {
          id?: string
          user_id?: string
          offer_title?: string
          offer_type?: string
          reward?: number
          clicked_at?: string
          completed_at?: string | null
          original_link?: string
          status?: string
          created_at?: string
          updated_at?: string
          device_info?: Json
          completion_time?: string | null
          category?: string | null
          points?: number
        }
      }
      offer_history: {
        Row: {
          id: string
          user_id: string
          offer_click_id: string
          status: string
          reward: number
          completed_at: string | null
          details: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          offer_click_id: string
          status: string
          reward: number
          completed_at?: string | null
          details?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          offer_click_id?: string
          status?: string
          reward?: number
          completed_at?: string | null
          details?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          user_id: string
          total_earnings: number
          completed_offers: number
          pending_offers: number
          rejected_offers: number
          success_rate: number
          average_reward: number
          last_offer_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          total_earnings?: number
          completed_offers?: number
          pending_offers?: number
          rejected_offers?: number
          success_rate?: number
          average_reward?: number
          last_offer_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_earnings?: number
          completed_offers?: number
          pending_offers?: number
          rejected_offers?: number
          success_rate?: number
          average_reward?: number
          last_offer_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_stats: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}