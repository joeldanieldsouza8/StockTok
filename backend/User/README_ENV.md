# User Service - Environment Variables Setup

## Overview
This service uses environment variables to manage sensitive configuration data like database credentials and Auth0 settings.

## Setup Instructions

### 1. Create your `.env` file
Copy the example file and update with your actual values:
```bash
cp .env.example .env
```

### 2. Update the `.env` file with your secrets
Edit `.env` and replace the placeholder values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=userdb
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password_here

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.stocktok.com

# Application Configuration
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5168
```

### 3. Run the service
```bash
dotnet run
```

The service will automatically load environment variables from the `.env` file on startup.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host address | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `userdb` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `your_password` |
| `AUTH0_DOMAIN` | Auth0 tenant domain | `your-tenant.us.auth0.com` |
| `AUTH0_AUDIENCE` | Auth0 API audience | `https://api.stocktok.com` |
| `ASPNETCORE_ENVIRONMENT` | ASP.NET environment | `Development` or `Production` |
| `ASPNETCORE_URLS` | URLs the service listens on | `http://localhost:5168` |

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit the `.env` file to version control
- The `.env` file is already listed in `.gitignore`
- Only commit `.env.example` with placeholder values
- `appsettings.json` no longer contains secrets and can be safely committed

## Docker Configuration

When running in Docker, pass environment variables using:
- Docker Compose `environment:` section
- Docker run `-e` flags
- Docker secrets (for production)

Example in `docker-compose.yml`:
```yaml
services:
  user-service:
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=userdb
      - DB_USERNAME=postgres
      - DB_PASSWORD=${DB_PASSWORD}
      - AUTH0_DOMAIN=${AUTH0_DOMAIN}
      - AUTH0_AUDIENCE=${AUTH0_AUDIENCE}
```

## Troubleshooting

### Service can't connect to database
- Verify your `.env` file exists in the `backend/User/` directory
- Check that `DB_PASSWORD` matches your PostgreSQL password
- Ensure PostgreSQL is running on the specified host and port

### Authentication errors
- Verify `AUTH0_DOMAIN` is correct (without `https://`)
- Check that `AUTH0_AUDIENCE` matches your Auth0 API identifier
- Ensure Auth0 is properly configured in your Auth0 dashboard
