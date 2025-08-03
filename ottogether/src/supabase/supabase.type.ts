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
      notifications: {
        Row: {
          id: string;
          user_id: string;
          sender_id: string;
          type: "comment" | "like_review" | "like_quote";
          target_id: number;
          message: string;
          is_read: boolean;
          created_at: string;
        }
        Insert: {
          id?: string;
          user_id: string;
          sender_id: string;
          type: "comment" | "like_review" | "like_quote";
          target_id: number;
          message: string;
          is_read?: boolean;
          created_at?: string;
        }
        Update: {
          id?: string;
          user_id?: string;
          sender_id?: string;
          type?: "comment" | "like_review" | "like_quote";
          target_id?: number;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profile";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "notifications_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "profile";
            referencedColumns: ["user_id"];
          }
        ]
      }
      comment: {
        Row: {
          created_at: string
          id: number
          review_id: number
          text_content: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          review_id?: number
          text_content?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          review_id?: number
          text_content?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorite_movies: {
        Row: {
          created_at: string
          id: string
          movie_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          comment: boolean | null
          like_quote: boolean | null
          like_review: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: boolean | null
          like_quote?: boolean | null
          like_review?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: boolean | null
          like_quote?: boolean | null
          like_review?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email_address: string
          favorite_genre: string[] | null
          header_url: string | null
          nickname: string | null
          preferred_ott: string[] | null
          quotesCount: number | null
          reviewsCount: number | null
          updated_at: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_address: string
          favorite_genre?: string[] | null
          header_url?: string | null
          nickname?: string | null
          preferred_ott?: string[] | null
          quotesCount?: number | null
          reviewsCount?: number | null
          updated_at?: string | null
          url?: string | null
          user_id?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_address?: string
          favorite_genre?: string[] | null
          header_url?: string | null
          nickname?: string | null
          preferred_ott?: string[] | null
          quotesCount?: number | null
          reviewsCount?: number | null
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
          likes: number
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
          likes?: number
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
          likes?: number
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
          id: number
          quote_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          quote_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          quote_id?: number
          user_id?: string
        }
        Relationships: []
      }
      review: {
        Row: {
          comment_count: number | null
          created_at: string
          dislike_count: number | null
          id: number
          like_count: number | null
          movie_id: number | null
          rating: number
          text_content: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_count?: number | null
          created_at?: string
          dislike_count?: number | null
          id?: number
          like_count?: number | null
          movie_id?: number | null
          rating: number
          text_content?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_count?: number | null
          created_at?: string
          dislike_count?: number | null
          id?: number
          like_count?: number | null
          movie_id?: number | null
          rating?: number
          text_content?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      review_like: {
        Row: {
          created_at: string
          id: number
          reaction_type: Database["public"]["Enums"]["Like/Dislike"] | null
          review_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          reaction_type?: Database["public"]["Enums"]["Like/Dislike"] | null
          review_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          reaction_type?: Database["public"]["Enums"]["Like/Dislike"] | null
          review_id?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement: {
        Args: {
          table_name: string
          id_column: string
          id_value: number
          column_name: string
        }
        Returns: undefined
      }
      increment: {
        Args: {
          table_name: string
          id_column: string
          id_value: number
          column_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      "Like/Dislike": "like" | "dislike"
      notification_type:
        | "comment"
        | "review_like"
        | "review_dislike"
        | "quote_like"
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
      notification_type: [
        "comment",
        "review_like",
        "review_dislike",
        "quote_like",
      ],
    },
  },
} as const
