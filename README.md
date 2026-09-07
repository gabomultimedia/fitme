# FitMe v2.1

> Tu gimnasio, tu app. PWA de fitness con onboarding de equipos, sesión activa y tracking de progreso.

**1 app, 1 proyecto Supabase, 2 usuarios** (Gabriel + Verónica). Cada quien con su perfil, equipos y datos privados. Comparten la misma base de datos pero el RLS asegura que cada uno solo ve lo suyo.

## Stack

- **Framework:** Next.js 16.3 (App Router) + React 19 + TypeScript 5
- **Estilos:** Tailwind CSS v4 con design tokens Kinetic Precision
- **DB:** Supabase (Postgres + Auth + Storage) — **1 proyecto compartido**
- **Charts:** Recharts 2.x
- **PWA:** Serwist
- **Icons:** lucide-react (sin emojis en código)

## Estructura

```
fitme-app/
├── src/
│   ├── app/
│   │   ├── (auth)/            # login + register
│   │   ├── (dashboard)/       # dashboard, exercises, progress, workouts
│   │   ├── (marketing)/       # welcome
│   │   ├── (onboarding)/      # equipo setup
│   │   └── api/auth/callback/ # OAuth + magic link callback
│   ├── components/
│   │   ├── auth/              # LoginForm, RegisterForm
│   │   ├── brand/             # FitMeLogo
│   │   ├── dashboard/         # StatsCard, StatsGrid, TodayRoutine
│   │   ├── equipment/         # EquipmentSelector
│   │   ├── exercise/          # ExerciseCard, ExerciseDetail
│   │   ├── landing/           # WelcomeHero
│   │   ├── progress/          # WeightChart, WeightLogForm
│   │   └── session/           # RestTimer, NumberStepper, RepsStepper, WeightStepper, SetHistoryTable, SessionCloseGuard
│   ├── lib/
│   │   ├── equipment/         # Catálogo de equipos
│   │   ├── exercises/         # data loader + filters
│   │   ├── session/           # useRestTimer (drift-free con timestamp)
│   │   ├── supabase/          # clients + types
│   │   ├── dates.ts           # helpers es-MX
│   │   └── utils.ts           # cn, formatNumber
│   ├── data/
│   │   └── exercises.json     # Free Exercise DB (876 ejercicios)
│   ├── styles/
│   │   └── tokens.css         # Design system Kinetic Precision
│   └── types/
│       └── exercise.ts
├── supabase/
│   └── migrations/            # 0001 schema + 0002 RLS + 0003 storage
├── public/
│   └── sw.js                  # generado por Serwist
├── next.config.ts             # PWA + image domains
└── .env.local.example
```

## Setup (5 min)

### 1. Instalar dependencias

```bash
cd fitme-app
npm install
```

### 2. Crear proyecto Supabase (UNO solo compartido)

1. https://supabase.com/dashboard/new
2. Nombre: `fitme-couple` (o como prefieras)
3. Region: us-east-1
4. Password: 32+ caracteres aleatorios

### 3. Aplicar migrations

En el SQL Editor de Supabase, ejecutar en orden:

1. `supabase/migrations/0001_initial_schema.sql` — crea todas las tablas
2. `supabase/migrations/0002_rls_policies.sql` — habilita RLS y policies
3. `supabase/migrations/0003_storage_policies.sql` — crea bucket + policies

### 4. Configurar Auth providers

En **Authentication → Providers**:

- **Email:** habilitado (para magic link)
- **Google:** crear OAuth app en Google Cloud Console
  - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`

### 5. Variables de entorno

```bash
cp .env.local.example .env.local
# Editar con las keys de Supabase (Settings → API)
```

### 6. Correr dev

```bash
npm run dev
# Abre http://localhost:3000
```

## Deploy a Vercel

```bash
# Conectar repo
vercel link

# Configurar env vars en Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL          (del proyecto compartido)
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_APP_NAME              (ej. "FitMe")

# Deploy
vercel --prod
```

## Multi-usuario (Gabriel + Verónica)

**1 app, 1 Supabase, 2 usuarios.** Cada quien:

1. Se registra independientemente con su email (magic link o Google)
2. Configura SUS equipos (cada quien puede tener equipo distinto si va a gimnasios diferentes)
3. Ve SOLO sus workouts, peso, fotos (RLS activo)
4. Pueden compartir la misma URL de la app — el login los identifica

**No hay "modo pareja"** por ahora. Si más adelante quieren ver el progreso del otro, agregamos un flag `is_public` por workout o una tabla `partnerships`.

## Decisiones de diseño

- **Sin emojis en código** (regla global QRETARIA) — usamos lucide-react
- **Material Symbols reemplazado por lucide-react** — tree-shakeable, sin Google Fonts
- **Timer drift-free** — `useRestTimer` usa timestamp + Page Visibility API
- **Sin modales** — solo páginas o confirmaciones inline (lección SOSOCO)
- **RLS activo** — cada usuario solo ve sus datos
- **Touch targets ≥ 44x44px** — accesibilidad desde el inicio
- **Tabular nums en stats** — sin jitter horizontal al cambiar números
- **prefers-reduced-motion respetado** — animaciones se reducen automáticamente

## Quality gates

```bash
npx tsc --noEmit        # TypeScript strict sin errores
npm run lint            # ESLint sin errores
npm run build           # Build de producción
```

Metas:
- Lighthouse Performance ≥ 90
- Lighthouse PWA ≥ 90
- Lighthouse Accessibility ≥ 90

## Próximas mejoras (post v2.1)

- [ ] Tests E2E con Playwright
- [ ] Tests unit con Vitest
- [ ] PDF export de rutinas
- [ ] Sincronización con HealthKit / Google Fit
- [ ] Rutinas pre-armadas (push/pull/legs)
- [ ] Comparador de fotos de progreso
