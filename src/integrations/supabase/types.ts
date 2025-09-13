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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      buyers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          purchased_credits: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          purchased_credits?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          purchased_credits?: number
          updated_at?: string
        }
        Relationships: []
      }
      credit_purchases: {
        Row: {
          buyer_id: string
          credits: number
          currency: string
          id: number
          price_per_tonne: number
          purchased_at: string
          site_id: string | null
        }
        Insert: {
          buyer_id: string
          credits: number
          currency?: string
          id?: never
          price_per_tonne: number
          purchased_at?: string
          site_id?: string | null
        }
        Update: {
          buyer_id?: string
          credits?: number
          currency?: string
          id?: never
          price_per_tonne?: number
          purchased_at?: string
          site_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_purchases_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      field_data: {
        Row: {
          area: number | null
          date: string | null
          id: number
          image_url: string | null
          latitude: number
          longitude: number
          plantation_type: string | null
        }
        Insert: {
          area?: number | null
          date?: string | null
          id?: never
          image_url?: string | null
          latitude: number
          longitude: number
          plantation_type?: string | null
        }
        Update: {
          area?: number | null
          date?: string | null
          id?: never
          image_url?: string | null
          latitude?: number
          longitude?: number
          plantation_type?: string | null
        }
        Relationships: []
      }
      field_workers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ndvi_data: {
        Row: {
          avg_ndvi: number | null
          carbon_estimate: number | null
          created_at: string | null
          id: number
          ndvi_snapshot_url: string | null
          site_id: number | null
        }
        Insert: {
          avg_ndvi?: number | null
          carbon_estimate?: number | null
          created_at?: string | null
          id?: never
          ndvi_snapshot_url?: string | null
          site_id?: number | null
        }
        Update: {
          avg_ndvi?: number | null
          carbon_estimate?: number | null
          created_at?: string | null
          id?: never
          ndvi_snapshot_url?: string | null
          site_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ndvi_data_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_data"
            referencedColumns: ["id"]
          },
        ]
      }
      ngos: {
        Row: {
          act_of_registration: string | null
          annual_report_url: string | null
          areas_of_work: string[] | null
          certificate_12a_80g_url: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          date_of_registration: string | null
          fcra_certificate_url: string | null
          field_worker_id: string
          geographic_focus: string | null
          has_12a_80g_registration: boolean | null
          has_fcra_registration: boolean | null
          id: string
          key_person_contact: string | null
          key_person_designation: string | null
          key_person_name: string
          ngo_name: string
          ngo_pan_number: string | null
          ngo_type: string
          past_current_projects: string | null
          registered_office_address: string | null
          registration_certificate_url: string | null
          registration_number: string
          updated_at: string
          website_social_links: string | null
        }
        Insert: {
          act_of_registration?: string | null
          annual_report_url?: string | null
          areas_of_work?: string[] | null
          certificate_12a_80g_url?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          date_of_registration?: string | null
          fcra_certificate_url?: string | null
          field_worker_id: string
          geographic_focus?: string | null
          has_12a_80g_registration?: boolean | null
          has_fcra_registration?: boolean | null
          id?: string
          key_person_contact?: string | null
          key_person_designation?: string | null
          key_person_name: string
          ngo_name: string
          ngo_pan_number?: string | null
          ngo_type: string
          past_current_projects?: string | null
          registered_office_address?: string | null
          registration_certificate_url?: string | null
          registration_number: string
          updated_at?: string
          website_social_links?: string | null
        }
        Update: {
          act_of_registration?: string | null
          annual_report_url?: string | null
          areas_of_work?: string[] | null
          certificate_12a_80g_url?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          date_of_registration?: string | null
          fcra_certificate_url?: string | null
          field_worker_id?: string
          geographic_focus?: string | null
          has_12a_80g_registration?: boolean | null
          has_fcra_registration?: boolean | null
          id?: string
          key_person_contact?: string | null
          key_person_designation?: string | null
          key_person_name?: string
          ngo_name?: string
          ngo_pan_number?: string | null
          ngo_type?: string
          past_current_projects?: string | null
          registered_office_address?: string | null
          registration_certificate_url?: string | null
          registration_number?: string
          updated_at?: string
          website_social_links?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          area: number
          carbon_estimate_tonnes: number | null
          created_at: string
          date_of_plantation: string | null
          field_worker_id: string
          id: string
          latitude: number
          longitude: number
          ndvi_avg: number | null
          plantation_type: string
          updated_at: string
          uploaded_image_url: string | null
        }
        Insert: {
          area: number
          carbon_estimate_tonnes?: number | null
          created_at?: string
          date_of_plantation?: string | null
          field_worker_id: string
          id?: string
          latitude: number
          longitude: number
          ndvi_avg?: number | null
          plantation_type: string
          updated_at?: string
          uploaded_image_url?: string | null
        }
        Update: {
          area?: number
          carbon_estimate_tonnes?: number | null
          created_at?: string
          date_of_plantation?: string | null
          field_worker_id?: string
          id?: string
          latitude?: number
          longitude?: number
          ndvi_avg?: number | null
          plantation_type?: string
          updated_at?: string
          uploaded_image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_field_worker_id_fkey"
            columns: ["field_worker_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
