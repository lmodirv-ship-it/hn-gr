export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_email: string | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json
          target_id: string | null
          target_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          metadata: Json | null
          path: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          metadata?: Json | null
          path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          metadata?: Json | null
          path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_connectors: {
        Row: {
          base_url: string | null
          config: Json
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          name: string
          provider: string
          secret_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name: string
          provider: string
          secret_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name?: string
          provider?: string
          secret_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: string | null
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          tags: Json
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: Json
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string
          cv_path: string | null
          cv_summary: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          notes: string | null
          phone: string | null
          specialty: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          cv_path?: string | null
          cv_summary?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          specialty: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          cv_path?: string | null
          cv_summary?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          specialty?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: []
      }
      mfa_settings: {
        Row: {
          created_at: string
          enabled: boolean
          enrolled_at: string | null
          last_verified_at: string | null
          method: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          enrolled_at?: string | null
          last_verified_at?: string | null
          method?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          enrolled_at?: string | null
          last_verified_at?: string | null
          method?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plugin_modules: {
        Row: {
          category: string | null
          config: Json
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          key: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string | null
          client: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          published: boolean
          slug: string
          sort_order: number
          tags: Json
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string | null
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          tags?: Json
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string | null
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          tags?: Json
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      pricing_cycles: {
        Row: {
          active: boolean
          created_at: string
          discount: number
          id: string
          key: string
          label_ar: string
          label_en: string
          months: number
          sort_order: number
          suffix_ar: string
          suffix_en: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          discount?: number
          id?: string
          key: string
          label_ar: string
          label_en: string
          months: number
          sort_order?: number
          suffix_ar: string
          suffix_en: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          discount?: number
          id?: string
          key?: string
          label_ar?: string
          label_en?: string
          months?: number
          sort_order?: number
          suffix_ar?: string
          suffix_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          features: Json
          id: string
          learn_more_path: string | null
          monthly_price: number
          name: string
          popular: boolean
          project_type: string | null
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          learn_more_path?: string | null
          monthly_price?: number
          name: string
          popular?: boolean
          project_type?: string | null
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          learn_more_path?: string | null
          monthly_price?: number
          name?: string
          popular?: boolean
          project_type?: string | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_requests: {
        Row: {
          budget: string | null
          created_at: string
          description: string
          email: string
          full_name: string
          id: string
          phone: string | null
          project_type: string
          status: Database["public"]["Enums"]["project_status"]
          timeline: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          description: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          project_type: string
          status?: Database["public"]["Enums"]["project_status"]
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          description?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          project_type?: string
          status?: Database["public"]["Enums"]["project_status"]
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      services_catalog: {
        Row: {
          active: boolean
          created_at: string
          currency: string | null
          description: string | null
          features: Json
          id: string
          price_from: number | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string | null
          description?: string | null
          features?: Json
          id?: string
          price_from?: number | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string | null
          description?: string | null
          features?: Json
          id?: string
          price_from?: number | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          key: string
          lang: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          lang: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          lang?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_site_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client" | "super_admin"
      application_status:
        | "new"
        | "in_review"
        | "shortlisted"
        | "interviewed"
        | "hired"
        | "rejected"
      post_status: "draft" | "published" | "scheduled"
      project_status:
        | "pending"
        | "in_review"
        | "active"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client", "super_admin"],
      application_status: [
        "new",
        "in_review",
        "shortlisted",
        "interviewed",
        "hired",
        "rejected",
      ],
      post_status: ["draft", "published", "scheduled"],
      project_status: [
        "pending",
        "in_review",
        "active",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
