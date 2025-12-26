# Dev Testing Page

## 🔧 Purpose

The `/dev` route provides a development-only testing interface for:
- Testing API endpoints
- Viewing authentication tokens
- Debugging backend communication
- Validating Auth0 integration

## 🚀 Usage

### Access the Dev Page

```bash
# Make sure you're running in development mode
npm run dev

# Open in browser
open http://localhost:3000/dev
```

### Test the Dummy Endpoint

1. **Login First**: Make sure you're authenticated via Auth0
2. **Click "Test Dummy Endpoint"**: This will call `/api/dummy`
3. **Check Terminal**: The access token will be logged in your Next.js terminal
4. **View Response**: Success or error response will be displayed on the page

## 🔒 Security

### Production Protection

The `/dev` route is protected in multiple ways:

1. **Layout Level**: Returns 404 in production
   ```typescript
   // src/app/dev/layout.tsx
   if (process.env.NODE_ENV === "production") {
     redirect("/")
   }
   ```

2. **Middleware Level**: Blocks access at the edge
   ```typescript
   // src/middleware.ts
   if (pathname.startsWith('/dev') && NODE_ENV === 'production') {
     return NextResponse.redirect('/')
   }
   ```

### When Deploying

The page is automatically disabled when `NODE_ENV=production`. No additional configuration needed!

## 📝 What Gets Logged

When you click "Test Dummy Endpoint", you'll see in the **terminal**:

```
--- Access Token Sent to .NET ---
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIs...
---------------------------------
```

And in the **browser**, you'll see either:

**Success:**
```json
{
  "message": "Hello from .NET!",
  "timestamp": "2025-12-20T..."
}
```

**Error:**
```json
{
  "error": "Unauthorized or failed to fetch data",
  "details": "..."
}
```

## 🛠️ Adding More Tests

To add more endpoint tests, update `/src/app/dev/page.tsx`:

```typescript
const testAnotherEndpoint = async () => {
  const res = await fetch("/api/your-endpoint")
  const data = await res.json()
  // Handle response
}
```

## 📁 Files

- `/src/app/dev/page.tsx` - Main dev testing page
- `/src/app/dev/layout.tsx` - Production protection
- `/src/middleware.ts` - Edge-level protection
- `/src/app/api/dummy/route.ts` - Dummy endpoint being tested

## 🧪 Testing Checklist

- [ ] Page loads at `/dev`
- [ ] Shows dev mode banner
- [ ] Login required (redirects if not logged in)
- [ ] Test button works
- [ ] Token logged in terminal
- [ ] Response displayed correctly
- [ ] Blocked in production (`NODE_ENV=production`)

## 🔗 Related

- `/health` - Health check page
- `/api/dummy` - Dummy API endpoint
- Auth0 authentication setup
