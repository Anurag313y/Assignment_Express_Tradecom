# User Management System — Frontend

## Setup

```bash
npm install
npm run dev
```

Opens the Vite dev server (default **http://localhost:5173**). Ensure the Flask API is running on **http://localhost:5000**; `/api` requests are proxied there (see `vite.config.ts`).

## Configuration

Optional: copy `.env.example` to `.env`. Defaults use **`VITE_API_BASE_URL=/api`** so behaviour matches the Docker Nginx setup.

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS v3
- shadcn/ui components
- Sonner (toast notifications)
