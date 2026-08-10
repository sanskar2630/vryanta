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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          company: string
          cover_note: string | null
          created_at: string
          id: string
          job_id: string | null
          job_ref: string
          job_title: string
          location: string | null
          match_score: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_ref: string
          job_title: string
          location?: string | null
          match_score?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          job_ref?: string
          job_title?: string
          location?: string | null
          match_score?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          end_year: string | null
          field: string | null
          grade: string | null
          id: string
          institution: string
          start_year: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          degree: string
          end_year?: string | null
          field?: string | null
          grade?: string | null
          id?: string
          institution: string
          start_year?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          degree?: string
          end_year?: string | null
          field?: string | null
          grade?: string | null
          id?: string
          institution?: string
          start_year?: string | null
          user_id?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          location: string | null
          start_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          start_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          start_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          category: string | null
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          keywords: string | null
          label: string
          location: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          keywords?: string | null
          label: string
          location?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          keywords?: string | null
          label?: string
          location?: string | null
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          category: string
          company: string
          created_at: string
          deadline: string | null
          employer_id: string
          experience_level: string | null
          id: string
          job_type: string
          location: string
          qualification: string | null
          requirements: string[]
          responsibilities: string[]
          skills: string[]
          status: string
          stipend: string | null
          summary: string | null
          title: string
          updated_at: string
          work_mode: string
        }
        Insert: {
          category: string
          company: string
          created_at?: string
          deadline?: string | null
          employer_id: string
          experience_level?: string | null
          id?: string
          job_type?: string
          location: string
          qualification?: string | null
          requirements?: string[]
          responsibilities?: string[]
          skills?: string[]
          status?: string
          stipend?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          work_mode?: string
        }
        Update: {
          category?: string
          company?: string
          created_at?: string
          deadline?: string | null
          employer_id?: string
          experience_level?: string | null
          id?: string
          job_type?: string
          location?: string
          qualification?: string | null
          requirements?: string[]
          responsibilities?: string[]
          skills?: string[]
          status?: string
          stipend?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          work_mode?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          kind: string
          link: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          link?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          kind?: string
          link?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about: string | null
          account_type: string
          avatar_url: string | null
          company_name: string | null
          company_type: string | null
          company_website: string | null
          created_at: string
          desired_titles: string[]
          email: string
          expected_salary: string | null
          experience_level: string | null
          full_name: string
          headline: string | null
          id: string
          interests: string[]
          is_fresher: boolean
          job_types: string[]
          languages: Json
          location: string | null
          notify_application_updates: boolean
          notify_employer_messages: boolean
          notify_job_alerts: boolean
          onboarding_completed: boolean
          phone: string | null
          preferred_locations: string[]
          resume_url: string | null
          skills: string[]
          updated_at: string
          visibility: string
          work_modes: string[]
        }
        Insert: {
          about?: string | null
          account_type?: string
          avatar_url?: string | null
          company_name?: string | null
          company_type?: string | null
          company_website?: string | null
          created_at?: string
          desired_titles?: string[]
          email?: string
          expected_salary?: string | null
          experience_level?: string | null
          full_name?: string
          headline?: string | null
          id: string
          interests?: string[]
          is_fresher?: boolean
          job_types?: string[]
          languages?: Json
          location?: string | null
          notify_application_updates?: boolean
          notify_employer_messages?: boolean
          notify_job_alerts?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          preferred_locations?: string[]
          resume_url?: string | null
          skills?: string[]
          updated_at?: string
          visibility?: string
          work_modes?: string[]
        }
        Update: {
          about?: string | null
          account_type?: string
          avatar_url?: string | null
          company_name?: string | null
          company_type?: string | null
          company_website?: string | null
          created_at?: string
          desired_titles?: string[]
          email?: string
          expected_salary?: string | null
          experience_level?: string | null
          full_name?: string
          headline?: string | null
          id?: string
          interests?: string[]
          is_fresher?: boolean
          job_types?: string[]
          languages?: Json
          location?: string | null
          notify_application_updates?: boolean
          notify_employer_messages?: boolean
          notify_job_alerts?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          preferred_locations?: string[]
          resume_url?: string | null
          skills?: string[]
          updated_at?: string
          visibility?: string
          work_modes?: string[]
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          company: string
          created_at: string
          id: string
          job_id: string | null
          job_ref: string
          job_title: string
          location: string | null
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          id?: string
          job_id?: string | null
          job_ref: string
          job_title: string
          location?: string | null
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          id?: string
          job_id?: string | null
          job_ref?: string
          job_title?: string
          location?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "job_seeker" | "employer" | "admin"
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
      app_role: ["job_seeker", "employer", "admin"],
    },
  },
} as const
