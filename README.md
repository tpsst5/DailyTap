# DailyTap

DailyTap is a monorepo with:

- `DailyTap.Api` - ASP.NET Core minimal API for auth and habits
- `DailyTap.UI` - Expo (React Native) app for iOS, Android, and web

## Repository Structure

- `DailyTap.Api` - backend API, MongoDB integration, JWT auth
- `DailyTap.UI` - mobile/web client using Expo Router
- `docker-compose.yml` - local development services (`mongo`, `api`, `ui`)
- `.do/app.yaml` - optional DigitalOcean App Platform spec backup

## Quick Start

1. Start MongoDB (required by the API).
2. Run `DailyTap.Api`.
3. Configure `DailyTap.UI` with the API URL.
4. Run `DailyTap.UI`.

Detailed instructions:

- API setup: [`DailyTap.Api/README.md`](DailyTap.Api/README.md)
- UI setup: [`DailyTap.UI/README.md`](DailyTap.UI/README.md)

## Local Development with Docker Compose

From the repo root:

```bash
# Start Mongo + API
docker compose --profile api up --build

# Start UI (in a second terminal)
docker compose --profile ui up --build
```

Notes:

- API is exposed on `http://localhost:61599`.
- MongoDB is exposed on `mongodb://localhost:27017`.
- UI dev ports are `19000`, `19001`, `19002`, and `19006`.

## Deployment

- Optional app spec template: [`.do/app.yaml`](.do/app.yaml)

`DailyTap.UI` Docker setup is intended for local development (Expo dev server), not a production web deployment.
