# DailyTap UI

Expo (React Native + Expo Router) client for DailyTap.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- TypeScript
- Expo Router
- NativeWind/Tailwind CSS

## Prerequisites

- Node.js 20+
- npm
- Running DailyTap API instance

## Environment Variables

Create `.env` in `DailyTap.UI` with:

```env
EXPO_PUBLIC_API_URL=http://localhost:61599
```

If testing on a physical device, use your machine IP instead of `localhost`, for example:

`EXPO_PUBLIC_API_URL=http://192.168.1.10:61599`

## Run Locally

From `DailyTap.UI`:

```bash
npm install
npm run start
```

Other scripts:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## API Integration

The app reads `EXPO_PUBLIC_API_URL` in `src/api/client.ts` and uses it for all API requests.

Ensure the API is running before login/register flows.

## Docker (Local Dev Only)

From repo root:

```bash
docker compose --profile ui up --build
```

This runs the Expo dev server and exposes ports:

- `19000`
- `19001`
- `19002`
- `19006`

## Related Docs

- Monorepo overview: [`../README.md`](../README.md)
- API setup: [`../DailyTap.Api/README.md`](../DailyTap.Api/README.md)
