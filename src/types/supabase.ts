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
      education: {
        Row: {
          created_at: string
          degree: string
          end_date: string
          field_of_study: string
          id: number
          school: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          degree: string
          end_date: string
          field_of_study: string
          id?: number
          school: string
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          degree?: string
          end_date?: string
          field_of_study?: string
          id?: number
          school?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      experience: {
        Row: {
          company: string | null
          created_at: string
          description: string
          end_date: string | null
          id: number
          is_present: boolean
          position: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description: string
          end_date?: string | null
          id?: number
          is_present?: boolean
          position: string
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string
          end_date?: string | null
          id?: number
          is_present?: boolean
          position?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: number
          question: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: number
          question: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          question?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          created_at: string
          date: string | null
          description: string | null
          id: number
          images: string[] | null
          industry: string | null
          technology: string[] | null
          title: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: number
          images?: string[] | null
          industry?: string | null
          technology?: string[] | null
          title?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: number
          images?: string[] | null
          industry?: string | null
          technology?: string[] | null
          title?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: number
          name: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          id: number
          is_male: boolean
          name: string
          position: string
          review: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_male?: boolean
          name: string
          position: string
          review: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_male?: boolean
          name?: string
          position?: string
          review?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_details: {
        Row: {
          business_email: string | null
          contact: number | null
          created_at: string
          date_of_birth: string | null
          description: string | null
          designations: string | null
          first_name: string | null
          id: number
          last_name: string | null
          location: string | null
          profile_image: string | null
          resume: string | null
          user_id: string | null
          years_of_experience: number | null
        }
        Insert: {
          business_email?: string | null
          contact?: number | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          designations?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          location?: string | null
          profile_image?: string | null
          resume?: string | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Update: {
          business_email?: string | null
          contact?: number | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          designations?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          location?: string | null
          profile_image?: string | null
          resume?: string | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
