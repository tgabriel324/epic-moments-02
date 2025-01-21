export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ar_interactions: {
        Row: {
          created_at: string
          device_info: string | null
          duration: number | null
          id: string
          stamp_id: string
          status: Database["public"]["Enums"]["ar_interaction_status"] | null
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
          status?: Database["public"]["Enums"]["ar_interaction_status"] | null
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
          status?: Database["public"]["Enums"]["ar_interaction_status"] | null
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
          },
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
          },
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
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          is_active?: boolean
          last_name?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      qr_code_settings: {
        Row: {
          background_color: string
          border_size: number | null
          border_style: string | null
          business_id: string
          created_at: string
          custom_text: string | null
          foreground_color: string
          id: string
          landing_page_description: string | null
          landing_page_logo_url: string | null
          landing_page_primary_color: string | null
          landing_page_title: string | null
          logo_url: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string
          border_size?: number | null
          border_style?: string | null
          business_id: string
          created_at?: string
          custom_text?: string | null
          foreground_color?: string
          id?: string
          landing_page_description?: string | null
          landing_page_logo_url?: string | null
          landing_page_primary_color?: string | null
          landing_page_title?: string | null
          logo_url?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string
          border_size?: number | null
          border_style?: string | null
          business_id?: string
          created_at?: string
          custom_text?: string | null
          foreground_color?: string
          id?: string
          landing_page_description?: string | null
          landing_page_logo_url?: string | null
          landing_page_primary_color?: string | null
          landing_page_title?: string | null
          logo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_code_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          },
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
          optimized_tracking_url: string | null
          status: Database["public"]["Enums"]["stamp_status"] | null
          tracking_data: Json | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          name: string
          optimized_tracking_url?: string | null
          status?: Database["public"]["Enums"]["stamp_status"] | null
          tracking_data?: Json | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          optimized_tracking_url?: string | null
          status?: Database["public"]["Enums"]["stamp_status"] | null
          tracking_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamps_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          name: Database["public"]["Enums"]["subscription_plan"]
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
          name: Database["public"]["Enums"]["subscription_plan"]
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
          name?: Database["public"]["Enums"]["subscription_plan"]
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
          },
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
          status: Database["public"]["Enums"]["video_status"] | null
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
          status?: Database["public"]["Enums"]["video_status"] | null
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
          status?: Database["public"]["Enums"]["video_status"] | null
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
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
