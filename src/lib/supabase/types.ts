// Tipos placeholder hasta que Gabriel corra `npx supabase gen types typescript --linked`
// Estos tipos se regeneran desde Supabase después de crear el proyecto y aplicar migrations.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          goal: "weight_loss" | "muscle_gain" | "both";
          level: "beginner" | "intermediate" | "advanced";
          weight_kg: number | null;
          height_cm: number | null;
          birthdate: string | null;
          equipment_available: string[];
          weight_goal_kg: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          goal: "weight_loss" | "muscle_gain" | "both";
          level: "beginner" | "intermediate" | "advanced";
          weight_kg?: number | null;
          height_cm?: number | null;
          birthdate?: string | null;
          equipment_available?: string[];
          weight_goal_kg?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      weight_logs: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          logged_on: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_kg: number;
          logged_on?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["weight_logs"]["Insert"]>;
        Relationships: [];
      };
      workout_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          target_muscle_groups: string[];
          archived_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          target_muscle_groups?: string[];
          archived_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workout_templates"]["Insert"]>;
        Relationships: [];
      };
      workout_template_exercises: {
        Row: {
          id: string;
          template_id: string;
          exercise_id: string;
          position: number;
          target_sets: number;
          target_reps: number;
          rest_seconds: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          template_id: string;
          exercise_id: string;
          position: number;
          target_sets?: number;
          target_reps?: number;
          rest_seconds?: number;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["workout_template_exercises"]["Insert"]>;
        Relationships: [];
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["workout_sessions"]["Insert"]>;
        Relationships: [];
      };
      session_sets: {
        Row: {
          id: string;
          session_id: string;
          exercise_id: string;
          set_number: number;
          reps: number;
          weight_kg: number | null;
          rpe: number | null;
          completed_at: string;
          is_warmup: boolean;
        };
        Insert: {
          id?: string;
          session_id: string;
          exercise_id: string;
          set_number: number;
          reps: number;
          weight_kg?: number | null;
          rpe?: number | null;
          completed_at?: string;
          is_warmup?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["session_sets"]["Insert"]>;
        Relationships: [];
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          storage_path: string;
          photo_date: string;
          body_part: "front" | "side" | "back";
          weight_kg: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          storage_path: string;
          photo_date?: string;
          body_part: "front" | "side" | "back";
          weight_kg?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["progress_photos"]["Insert"]>;
        Relationships: [];
      };
      exercise_favorites: {
        Row: {
          user_id: string;
          exercise_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["exercise_favorites"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["exercise_favorites"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
