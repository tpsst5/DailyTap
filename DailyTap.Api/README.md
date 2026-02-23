# DailyTap API

ASP.NET Core minimal API for DailyTap authentication and habit tracking.

## Tech Stack

- .NET 10 (`net10.0`)
- ASP.NET Core minimal APIs
- MongoDB
- JWT Bearer authentication
- Swagger (enabled in Development)

## Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Habits (requires Bearer token)

- `GET /habits/`
- `POST /habits/`
- `PUT /habits/{id}`
- `DELETE /habits/{id}`

## Configuration

Settings are read from `appsettings.json` and environment variables.

Required keys:

- `MongoSettings__ConnectionString`
- `MongoSettings__Database`
- `MongoSettings__UsersCollection`
- `MongoSettings__HabitsCollection`
- `JwtOptions__Issuer`
- `JwtOptions__Audience`
- `JwtOptions__SigningKey`
- `JwtOptions__ExpiresMinutes`

Root `.env.example` includes:

```env
JwtOptions__SigningKey=CHANGE_ME_TO_A_LONG_RANDOM_STRING
```

Use a strong, random signing key in every environment.

## Run Locally (without Docker)

From `DailyTap.Api`:

```bash
dotnet restore
dotnet run
```

By default, the app uses values in `appsettings.json` (including `mongodb://localhost:27017`).

Swagger UI is available in Development at:

`/swagger`

## Run with Docker

From repo root:

```bash
docker compose --profile api up --build
```

This starts:

- `mongo` on `27017`
- `api` on `61599` (container port `8080`)

## Deployment

If you need to redeploy or recreate DigitalOcean App Platform settings, you can use:

- `../.do/app.yaml`
