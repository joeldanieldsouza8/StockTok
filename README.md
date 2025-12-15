# StockTok

A microservices-based application with a Next.js frontend and .NET backend services.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/) (or your configured database)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│   API Gateway   │────▶│  User Service   │
│   (Next.js)     │     │     (.NET)      │     │     (.NET)      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │    Database     │
                                                │  (PostgreSQL)   │
                                                │                 │
                                                └─────────────────┘
```

## Getting Started

### ⚠️ Important: Service Startup Order

Services must be started in the following order:

1. **Database** (PostgreSQL)
2. **User Service** (.NET)
3. **API Gateway** (.NET)
4. **Frontend** (Next.js)

---

### Step 1: Start the Database

Make sure PostgreSQL is running and the database is configured:

```bash
# If using local PostgreSQL
psql -U postgres -c "CREATE DATABASE stocktok_users;"

# Or if using Docker
docker run --name stocktok-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=stocktok_users \
  -p 5432:5432 \
  -d postgres:15
```

---

### Step 2: Start the User Service

```bash
cd backend/User

# Restore dependencies
dotnet restore

# Apply database migrations (if using EF Core)
dotnet ef database update

# Run the service
dotnet run
```

The User Service will start on `http://localhost:5001` (or configured port).

---

### Step 3: Start the API Gateway

```bash
cd backend/ApiGateway

# Restore dependencies
dotnet restore

# Run the gateway
dotnet run
```

The API Gateway will start on `http://localhost:5000` (or configured port).

---

### Step 4: Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The Frontend will start on `http://localhost:3000`.

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-audience
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### User Service (`backend/User/appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=stocktok_users;Username=postgres;Password=yourpassword"
  },
  "Auth0": {
    "Domain": "your-tenant.auth0.com",
    "Audience": "your-api-audience"
  }
}
```

---

## API Endpoints

### User Service (via API Gateway)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Health check |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| POST | `/api/users/login` | Handle login (sync/create user) |

### Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with market overview and features |
| `/health` | Health check page - displays session info and API tester |
| `/onboarding` | User onboarding flow after Auth0 login |
| `/auth/login` | Auth0 login redirect |
| `/auth/logout` | Auth0 logout redirect |

---

## Authentication Flow

1. User clicks "Login" on the frontend
2. Auth0 handles authentication
3. On success, user is redirected to `/onboarding`
4. Frontend calls `/api/users/login` to sync user with backend
5. Backend returns:
   - `200 OK` - Existing user found
   - `201 Created` - New user created
6. User is redirected to the dashboard

---

## TODO

- [ ] **Add Docker Compose** - Launch all services with a single command:
  ```bash
  docker-compose up
  ```

- [ ] **Remove verbose logging in .NET services** - Clean up console output for production

- [x] **Add health check page** - `/health` page for session and API testing

- [ ] **Add CI/CD pipeline** - Automated testing and deployment

- [ ] **Add service discovery** - For dynamic service registration

---

## UI Theme

The app uses a custom dark theme with teal accent colors:

- **Primary Color:** `#388A7D` (Teal)
- **Background:** Dark blue-gray
- **Mode:** Dark mode only (forced)

Theme colors are defined in `frontend/src/app/globals.css`.

---

## Future Docker Setup (Coming Soon)

```yaml
# docker-compose.yml (TODO)
version: '3.8'
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: stocktok_users
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"

  user-service:
    build: ./backend/User
    depends_on:
      - database
    ports:
      - "5001:5001"

  api-gateway:
    build: ./backend/ApiGateway
    depends_on:
      - user-service
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    depends_on:
      - api-gateway
    ports:
      - "3000:3000"
```

Then run:
```bash
docker-compose up --build
```

---

## Troubleshooting

### "Cannot connect to User Service"
- Ensure the User Service is running on the correct port
- Check that the API Gateway configuration points to the correct User Service URL

### "Database connection failed"
- Verify PostgreSQL is running
- Check connection string in `appsettings.json`
- Ensure the database exists

### "Auth0 authentication failed"
- Verify environment variables are set correctly
- Check Auth0 dashboard for correct callback URLs
- Ensure the audience matches in both frontend and backend

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.