# BodyQ Web — Component Hierarchy & Structure

## Decisions

- **Routing:** React Router v6. Public routes: Landing, Dashboard, Activity, Nutrition, AI Insights. Protected: Profile (requires mock auth).
- **Layout:** One global layout (NavigationBar + main outlet). Landing keeps full-width marketing feel; app pages share the same nav.
- **Auth:** UI-only mock (context with `isAuthenticated` + user). No backend. Protected route redirects to Dashboard if not authenticated.
- **Theme:** Existing CSS variables in `index.css`; reusable components use them for consistency.

## Component Hierarchy

```
App (Router)
├── AuthProvider (mock auth state)
│   └── Routes
│       ├── Layout (global: NavigationBar + outlet)
│       │   ├── NavigationBar
│       │   │   ├── Logo (Link → /)
│       │   │   ├── Nav links (Dashboard, Activity, Nutrition, AI Insights)
│       │   │   ├── ProfileIcon (Link → /profile)
│       │   │   └── CTA (e.g. Install App)
│       │   └── Outlet → page content
│       │
│       ├── / → Landing (Hero, Features, DashboardPreview, Footer)
│       ├── /dashboard → DashboardPage
│       ├── /activity → ActivityPage
│       ├── /nutrition → NutritionPage
│       ├── /insights → InsightsPage (AI insights / recommendations)
│       └── /profile → ProtectedRoute → ProfilePage
│
├── ui/ (reusable)
│   ├── Button (primary, secondary, outline)
│   ├── Card (title, children, optional padding)
│   ├── Input (label, error, controlled)
│   └── PageContainer (max-width, padding, section spacing)
│
└── pages/
    ├── LandingPage (existing sections)
    ├── DashboardPage
    ├── ActivityPage
    ├── NutritionPage
    ├── InsightsPage (AI insights / recommendations)
    └── ProfilePage (user info, goals, activity level, preferences, Edit Profile)
```

## Naming Conventions

- Components: PascalCase.
- Props/handlers: camelCase.
- Route paths: lowercase, e.g. `/dashboard`, `/profile`.
- Files: PascalCase for components (e.g. `NavigationBar.jsx`), camelCase for context/hooks.
