-- FitMe v2.1 — Schema inicial
-- Aplicar en Supabase SQL Editor en orden.

-- ============================================================================
-- 1. profiles
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('weight_loss', 'muscle_gain', 'both')),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  weight_kg DECIMAL(4,1),
  height_cm INTEGER,
  birthdate DATE,
  equipment_available TEXT[] NOT NULL DEFAULT '{}',
  weight_goal_kg DECIMAL(4,1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. weight_logs — bitácora de peso
-- ============================================================================
CREATE TABLE weight_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(4,1) NOT NULL,
  logged_on DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_weight_logs_user_date ON weight_logs(user_id, logged_on DESC);

-- ============================================================================
-- 3. workout_templates — rutinas
-- ============================================================================
CREATE TABLE workout_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_muscle_groups TEXT[] NOT NULL DEFAULT '{}',
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_workout_templates_user ON workout_templates(user_id) WHERE archived_at IS NULL;

-- ============================================================================
-- 4. workout_template_exercises — ejercicios en rutinas
-- ============================================================================
CREATE TABLE workout_template_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  target_sets INTEGER NOT NULL DEFAULT 3,
  target_reps INTEGER NOT NULL DEFAULT 10,
  rest_seconds INTEGER NOT NULL DEFAULT 90,
  notes TEXT
);
CREATE INDEX idx_template_exercises_template ON workout_template_exercises(template_id, position);

-- ============================================================================
-- 5. workout_sessions — sesiones ejecutadas
-- ============================================================================
CREATE TABLE workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  notes TEXT
);
CREATE INDEX idx_sessions_user_started ON workout_sessions(user_id, started_at DESC);

-- ============================================================================
-- 6. session_sets — series ejecutadas
-- ============================================================================
CREATE TABLE session_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight_kg DECIMAL(5,1),
  rpe SMALLINT CHECK (rpe BETWEEN 1 AND 10),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_warmup BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_session_sets_session ON session_sets(session_id);

-- ============================================================================
-- 7. progress_photos — fotos de progreso
-- ============================================================================
CREATE TABLE progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
  body_part TEXT NOT NULL CHECK (body_part IN ('front', 'side', 'back')),
  weight_kg DECIMAL(4,1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. exercise_favorites — ejercicios favoritos
-- ============================================================================
CREATE TABLE exercise_favorites (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, exercise_id)
);

-- ============================================================================
-- 9. Trigger updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
