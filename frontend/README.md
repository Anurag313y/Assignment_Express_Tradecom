# User Management System — Frontend

## Setup

```bash
npm install
npm run dev
```

## Configuration

Copy `.env.example` to `.env` and set your backend API URL:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Connecting to Your Backend

Edit `src/lib/api.ts` to replace the mock functions with real API calls using `fetch` or `axios`. The `BASE_URL` is already configured from the environment variable.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS v3
- shadcn/ui components
- Sonner (toast notifications)
