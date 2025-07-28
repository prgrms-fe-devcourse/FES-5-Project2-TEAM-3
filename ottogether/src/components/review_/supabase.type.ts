export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      comment: {
        Row: {
          created_at: string
          id: number
          review_id: number
          text_content: string
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          review_id?: number
          text_content?: string
          updated_at?: string
          user_id?: number
        }
        Update: {
          created_at?: string
          id?: number
          review_id?: number
          text_content?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          favorite_genre: string[] | null
          header_url: string | null
          nickname: string | null
          preferred_ott: string[] | null
          updated_at: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          favorite_genre?: string[] | null
          header_url?: string | null
          nickname?: string | null
          preferred_ott?: string[] | null
          updated_at?: string | null
          url?: string | null
          user_id?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          favorite_genre?: string[] | null
          header_url?: string | null
          nickname?: string | null
          preferred_ott?: string[] | null
          updated_at?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          author: string
          content: string
          created_at: string | null
          id: number
          is_visible: boolean | null
          likes: number | null
          movie_id: string | null
          person: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author?: string
          content?: string
          created_at?: string | null
          id?: number
          is_visible?: boolean | null
          likes?: number | null
          movie_id?: string | null
          person?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          id?: number
          is_visible?: boolean | null
          likes?: number | null
          movie_id?: string | null
          person?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      quotes_like: {
        Row: {
          created_at: string
          review_id: number
          user_id: number
        }
        Insert: {
          created_at: string
          review_id?: number
          user_id?: number
        }
        Update: {
          created_at?: string
          review_id?: number
          user_id?: number
        }
        Relationships: []
      }
      review: {
        Row: {
          comment_count: number
          created_at: string
          dislike_count: number
          id: number
          like_count: number
          movie_id: number
          rating: number
          text_content: string
          updated_at: string
          user_id: number
        }
        Insert: {
          comment_count?: number
          created_at?: string
          dislike_count?: number
          id?: number
          like_count?: number
          movie_id?: number
          rating: number
          text_content?: string
          updated_at?: string
          user_id?: number
        }
        Update: {
          comment_count?: number
          created_at?: string
          dislike_count?: number
          id?: number
          like_count?: number
          movie_id?: number
          rating?: number
          text_content?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: []
      }
      review_like: {
        Row: {
          created_at: string
          reaction_type: Database["public"]["Enums"]["Like/Dislike"] | null
          review_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          reaction_type?: Database["public"]["Enums"]["Like/Dislike"] | null
          review_id?: number
          user_id?: number
        }
        Update: {
          created_at?: string
          reaction_type?: Database["public"]["Enums"]["Like/Dislike"] | null
          review_id?: number
          user_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      "Like/Dislike": "like" | "dislike"
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
      "Like/Dislike": ["like", "dislike"],
    },
  },
} as const
