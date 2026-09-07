-- FitMe v2.1 — Row Level Security policies
-- CRÍTICO: cada usuario solo ve/modifica SUS datos.

-- Activar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_favorites ENABLE ROW LEVEL SECURITY;

-- Helper: policy "Users own data" para tablas con user_id directo
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'weight_logs',
      'workout_sessions',
      'progress_photos',
      'exercise_favorites'
    ])
  LOOP
    EXECUTE format('
      CREATE POLICY "Users read own %I" ON %I FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "Users insert own %I" ON %I FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY "Users update own %I" ON %I FOR UPDATE USING (auth.uid() = user_id);
      CREATE POLICY "Users delete own %I" ON %I FOR DELETE USING (auth.uid() = user_id);
    ', t, t, t, t, t, t, t, t);
  END LOOP;
END $$;

-- profiles: el id ES el user_id
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- workout_templates: tienen user_id
CREATE POLICY "Users read own templates" ON workout_templates
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own templates" ON workout_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own templates" ON workout_templates
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own templates" ON workout_templates
  FOR DELETE USING (auth.uid() = user_id);

-- workout_template_exercises: acceso via template_id
CREATE POLICY "Users read template exercises" ON workout_template_exercises
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM workout_templates t WHERE t.id = template_id AND t.user_id = auth.uid())
  );
CREATE POLICY "Users insert template exercises" ON workout_template_exercises
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM workout_templates t WHERE t.id = template_id AND t.user_id = auth.uid())
  );
CREATE POLICY "Users update template exercises" ON workout_template_exercises
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM workout_templates t WHERE t.id = template_id AND t.user_id = auth.uid())
  );
CREATE POLICY "Users delete template exercises" ON workout_template_exercises
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM workout_templates t WHERE t.id = template_id AND t.user_id = auth.uid())
  );

-- session_sets: acceso via session_id
CREATE POLICY "Users read session sets" ON session_sets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users insert session sets" ON session_sets
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users update session sets" ON session_sets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users delete session sets" ON session_sets
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
