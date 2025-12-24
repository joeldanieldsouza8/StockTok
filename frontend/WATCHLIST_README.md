# Watchlist Dashboard

A complete watchlist management UI for tracking stock tickers, built with Next.js, TypeScript, and shadcn/ui.

## Features

### 🎯 Core Functionality
- **Create Watchlists**: Organize stocks into named watchlists
- **Manage Tickers**: Add/remove stock tickers with company names
- **Top Tickers**: View most frequently tracked stocks across all watchlists
- **Edit & Delete**: Rename or remove watchlists with confirmation dialogs
- **Real-time Updates**: Automatic UI refresh after every operation

### 🎨 UI Components
- **Responsive Dashboard**: Grid layout adapts to mobile, tablet, and desktop
- **Interactive Cards**: Hover effects and smooth transitions
- **Modal Dialogs**: Clean forms for create/edit/delete operations
- **Empty States**: Helpful guidance when no data exists
- **Loading States**: Skeleton loaders and spinner animations

## File Structure

```
frontend/src/
├── app/
│   ├── api/
│   │   └── watchlists/
│   │       ├── route.ts                    # GET all, POST create
│   │       ├── top-tickers/
│   │       │   └── route.ts                # GET top tickers
│   │       └── [id]/
│   │           ├── route.ts                # GET, PUT, DELETE watchlist
│   │           └── tickers/
│   │               ├── route.ts            # POST add ticker
│   │               └── [tickerId]/
│   │                   └── route.ts        # DELETE remove ticker
│   └── dashboard/
│       └── page.tsx                        # Main dashboard page
├── components/
│   ├── ui/                                  # shadcn components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── separator.tsx
│   └── watchlist/
│       ├── WatchlistCard.tsx               # Individual watchlist display
│       ├── CreateWatchlistDialog.tsx
│       ├── EditWatchlistDialog.tsx
│       ├── DeleteWatchlistDialog.tsx
│       └── AddTickerDialog.tsx
├── services/
│   └── watchlist.service.ts                # Client-side API wrapper
└── types/
    ├── index.ts
    └── watchlist.ts                        # TypeScript interfaces
```

## Usage

### Access the Dashboard

Navigate to `/dashboard` in your browser:
```
http://localhost:3000/dashboard
```

### Authentication Setup

The watchlist feature uses **Next.js API routes** as a proxy layer. Each API route:
1. Uses Auth0's `getAccessToken()` to get the JWT token
2. Forwards the request to the backend with the `Authorization` header
3. Returns the response to the frontend

**No additional setup required** - authentication is handled automatically by the API routes using your existing Auth0 configuration.

### API Architecture

```
Frontend Component
    ↓
  fetch("/api/watchlists")  ← Client-side fetch (no auth needed)
    ↓
Next.js API Route (/app/api/watchlists/route.ts)
    ↓
  auth0.getAccessToken()  ← Gets JWT token server-side
    ↓
  fetch(BACKEND_API_URL)  ← Forwards to backend with token
    ↓
API Gateway (localhost:5069)
    ↓
User Microservice (localhost:5168)
```

### Environment Variables

Add to your `.env.local`:

```bash
# Backend API URL (API Gateway)
BACKEND_API_URL=http://localhost:5069

# Auth0 Configuration (should already exist)
AUTH0_SECRET=your-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://dev-p44mo426qxs1apjs.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.stocktok.com
```

## Component API

### WatchlistCard

```tsx
<WatchlistCard
  watchlist={watchlist}
  onDelete={(id) => handleDelete(id)}
  onUpdate={(id, name) => handleUpdate(id, name)}
  onRefresh={() => loadData()}
/>
```

### CreateWatchlistDialog

```tsx
<CreateWatchlistDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onCreate={async (name) => {
    await watchlistService.createWatchlist({ name });
  }}
/>
```

### AddTickerDialog

```tsx
<AddTickerDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  watchlistId="watchlist-guid"
  watchlistName="Tech Stocks"
  onSuccess={() => refresh()}
/>
```

## Backend Integration

### Required Endpoints

The UI expects these endpoints (all prefixed with `/api/watchlists`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all watchlists |
| GET | `/:id` | Get specific watchlist |
| GET | `/top-tickers?count=5` | Get top N tickers |
| POST | `/` | Create watchlist |
| PUT | `/:id` | Update watchlist name |
| DELETE | `/:id` | Delete watchlist |
| POST | `/:id/tickers` | Add ticker to watchlist |
| DELETE | `/:id/tickers/:tickerId` | Remove ticker |

### Request/Response Examples

**Create Watchlist:**
```json
POST /api/watchlists
{
  "name": "Tech Stocks"
}

Response 201:
{
  "id": "guid",
  "name": "Tech Stocks",
  "tickers": [],
  "createdAt": "2025-12-24T...",
  "updatedAt": "2025-12-24T..."
}
```

**Add Ticker:**
```json
POST /api/watchlists/{id}/tickers
{
  "tickerId": "AAPL",
  "stockName": "Apple Inc."
}

Response 200:
{
  "id": "guid",
  "name": "Tech Stocks",
  "tickers": [
    {
      "id": "AAPL",
      "stockName": "Apple Inc."
    }
  ],
  ...
}
```

## Styling

The UI uses Tailwind CSS with shadcn/ui theming. Key design decisions:

- **Colors**: Uses CSS variables for theme colors (`--primary`, `--destructive`, etc.)
- **Spacing**: Consistent `gap-*` and `space-y-*` utilities
- **Hover Effects**: Opacity transitions on interactive elements
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

## Error Handling

All API calls include try/catch blocks with:
- Console error logging
- User-friendly error messages in dialogs
- Loading states during operations
- Optimistic UI updates where appropriate

## Future Enhancements

- [ ] Search/filter watchlists
- [ ] Drag-and-drop to reorder tickers
- [ ] Bulk ticker operations
- [ ] Import/export watchlists
- [ ] Real-time price updates
- [ ] Ticker autocomplete from market data API
- [ ] Watchlist sharing functionality
- [ ] Performance analytics per watchlist

## Troubleshooting

**401 Unauthorized errors:**
- Ensure Auth0 token is stored in localStorage as `auth_token`
- Verify token hasn't expired
- Check API Gateway is forwarding Authorization header

**CORS errors:**
- API Gateway should have CORS enabled
- Frontend must run on expected origin

**Components not found:**
- Run `npm install` to ensure all dependencies are installed
- TypeScript may need a restart in VS Code (Cmd+Shift+P → "Restart TS Server")
