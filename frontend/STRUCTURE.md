# Frontend Structure

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   ├── market/               # Market feature pages
│   │   │   └── [ticker]/         # Dynamic ticker pages
│   │   ├── onboarding/           # Onboarding flow
│   │   ├── health/               # Health check
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── home/                 # Home page components
│   │   │   ├── hero-section.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── community-section.tsx
│   │   │   ├── watchlist-section.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── market/               # Market feature components
│   │   │   ├── stock-chart.tsx
│   │   │   ├── fundamentals-display.tsx
│   │   │   ├── market-overview.tsx
│   │   │   ├── chart-preview.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/                 # Authentication components
│   │   │   ├── profile.tsx
│   │   │   ├── user-onboarding.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── shared/               # Shared/common components
│   │       ├── loading-screen.tsx
│   │       ├── three-background.tsx
│   │       └── index.ts
│   │
│   ├── lib/                      # Utilities and configs
│   │   ├── utils.ts              # Utility functions (cn, etc.)
│   │   └── auth0.ts              # Auth0 configuration
│   │
│   ├── services/                 # API service layers
│   │   └── market.service.ts     # Market data API calls
│   │
│   ├── types/                    # TypeScript types
│   │   ├── market.ts             # Market-related types
│   │   ├── user.ts               # User-related types
│   │   └── index.ts              # Type exports
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── (to be added)
│   │
│   └── middleware.ts             # Next.js middleware
│
├── public/                       # Static assets
├── .env                          # Environment variables
└── [config files]
```

## 🎯 Component Organization Principles

### 1. **Feature-Based Organization**
Components are grouped by feature/domain:
- `layout/` - Persistent layout components (navbar, footer)
- `home/` - Home page specific components
- `market/` - Market/stock related components
- `auth/` - Authentication related components
- `shared/` - Reusable components used across features

### 2. **Import Patterns**

#### UI Components
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

#### Feature Components
```typescript
// Using index files for cleaner imports
import { Navbar, Footer } from "@/components/layout";
import { HeroSection, FeaturesSection } from "@/components/home";
import { StockChart, MarketOverview } from "@/components/market";
```

#### Utilities
```typescript
import { cn } from "@/lib/utils";
import { auth0 } from "@/lib/auth0";
```

#### Services
```typescript
import { marketService } from "@/services/market.service";
```

#### Types
```typescript
import type { User, StockData } from "@/types";
```

### 3. **Naming Conventions**

- **Files**: kebab-case (`stock-chart.tsx`, `market-overview.tsx`)
- **Components**: PascalCase (`StockChart`, `MarketOverview`)
- **Functions/Variables**: camelCase (`fetchStockData`, `userName`)
- **Types/Interfaces**: PascalCase (`User`, `StockData`)

### 4. **File Structure**

Each component file should follow this pattern:
```typescript
"use client" // If client component

// External imports
import { useState } from "react";

// Internal imports - UI components
import { Button } from "@/components/ui/button";

// Internal imports - Other components
import { SomeComponent } from "@/components/feature";

// Utils and services
import { cn } from "@/lib/utils";
import { someService } from "@/services/some.service";

// Types
import type { SomeType } from "@/types";

// Component
export function ComponentName() {
  // Component logic
}
```

## 🔧 Services Layer

Services handle API communication:
```typescript
// src/services/market.service.ts
export const marketService = {
  async getStock(ticker: string) {
    const response = await fetch(`/api/market/ticker/${ticker}`);
    return response.json();
  }
};
```

## 📝 Adding New Features

### Dashboard Example

1. **Create route**:
   ```bash
   mkdir -p src/app/dashboard
   touch src/app/dashboard/page.tsx
   ```

2. **Create components**:
   ```bash
   mkdir -p src/components/dashboard
   touch src/components/dashboard/portfolio.tsx
   touch src/components/dashboard/watchlist-widget.tsx
   touch src/components/dashboard/index.ts
   ```

3. **Export in index.ts**:
   ```typescript
   export { Portfolio } from "./portfolio";
   export { WatchlistWidget } from "./watchlist-widget";
   ```

4. **Use in page**:
   ```typescript
   import { Portfolio, WatchlistWidget } from "@/components/dashboard";
   ```

## 🚀 Best Practices

1. **Keep components focused**: One component, one responsibility
2. **Use index files**: Export multiple components from a feature
3. **Co-locate related code**: Keep components, styles, and tests together
4. **Leverage TypeScript**: Define types in `src/types/`
5. **Server vs Client**: Use `"use client"` only when needed
6. **Avoid deep nesting**: Max 3-4 levels of component hierarchy

## 🧪 Testing Structure (Future)

```
src/
└── components/
    └── market/
        ├── stock-chart.tsx
        └── stock-chart.test.tsx
```

## 📦 Path Aliases

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Use `@/` prefix for all internal imports.
