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
      ar_interactions: {
        Row: {
          created_at: string
          device_info: string | null
          duration: number | null
          id: string
          stamp_id: string
          status: "started" | "completed" | "failed" | null
          updated_at: string
          user_agent: string | null
          video_id: string
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          duration?: number | null
          id?: string
          stamp_id: string
          status?: "started" | "completed" | "failed" | null
          updated_at?: string
          user_agent?: string | null
          video_id: string
        }
        Update: {
          created_at?: string
          device_info?: string | null
          duration?: number | null
          id?: string
          stamp_id?: string
          status?: "started" | "completed" | "failed" | null
          updated_at?: string
          user_agent?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ar_interactions_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ar_interactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      qr_codes: {
        Row: {
          id: string
          stamp_id: string
          business_id: string
          custom_url: string | null
          branding_color: string | null
          branding_logo_url: string | null
          downloads_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stamp_id: string
          business_id: string
          custom_url?: string | null
          branding_color?: string | null
          branding_logo_url?: string | null
          downloads_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stamp_id?: string
          business_id?: string
          custom_url?: string | null
          branding_color?: string | null
          branding_logo_url?: string | null
          downloads_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      business_subscriptions: {
        Row: {
          business_id: string | null
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          plan_id: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          start_date?: string
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      cdn_settings: {
        Row: {
          cdn_url: string
          created_at: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          cdn_url: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          cdn_url?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          first_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          updated_at: string
          user_type: "admin" | "business_owner" | "end_user"
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          is_active?: boolean
          last_name?: string | null
          updated_at?: string
          user_type?: "admin" | "business_owner" | "end_user"
        }
        Update: {
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          updated_at?: string
          user_type?: "admin" | "business_owner" | "end_user"
        }
        Relationships: []
      }
      stamp_video_links: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          stamp_id: string
          updated_at: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          stamp_id: string
          updated_at?: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          stamp_id?: string
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamp_video_links_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamp_video_links_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      stamps: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
          status: "active" | "inactive" | "deleted" | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          name: string
          status?: "active" | "inactive" | "deleted" | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          status?: "active" | "inactive" | "deleted" | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamps_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          has_advanced_reports: boolean | null
          has_custom_branding: boolean | null
          has_detailed_metrics: boolean | null
          has_priority_support: boolean | null
          id: string
          max_stamps: number
          name: "free" | "pro" | "enterprise"
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          has_advanced_reports?: boolean | null
          has_custom_branding?: boolean | null
          has_detailed_metrics?: boolean | null
          has_priority_support?: boolean | null
          id?: string
          max_stamps: number
          name: "free" | "pro" | "enterprise"
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          has_advanced_reports?: boolean | null
          has_custom_branding?: boolean | null
          has_detailed_metrics?: boolean | null
          has_priority_support?: boolean | null
          id?: string
          max_stamps?: number
          name?: "free" | "pro" | "enterprise"
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          month_year: string
          stamp_count: number | null
          total_interactions: number | null
          total_views: number | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          month_year: string
          stamp_count?: number | null
          total_interactions?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          month_year?: string
          stamp_count?: number | null
          total_interactions?: number | null
          total_views?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      videos: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          duration: number | null
          id: string
          name: string
          status: "processing" | "ready" | "error" | "deleted" | null
          updated_at: string
          video_url: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          name: string
          status?: "processing" | "ready" | "error" | "deleted" | null
          updated_at?: string
          video_url: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          name?: string
          status?: "processing" | "ready" | "error" | "deleted" | null
          updated_at?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ar_interaction_status: "started" | "completed" | "failed"
      stamp_status: "active" | "inactive" | "deleted"
      subscription_plan: "free" | "pro" | "enterprise"
      user_type: "admin" | "business_owner" | "end_user"
      video_status: "processing" | "ready" | "error" | "deleted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]