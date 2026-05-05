# Demo Video


https://github.com/user-attachments/assets/d21787f5-0a3a-4e08-b572-9892b108665c





# User Management — Express Tradecom Assignment

Flask REST API (MySQL, JWT) with a React (Vite + TypeScript) frontend. **Recommended:** run everything with Docker Compose so databases, ports, and API URLs match on any machine.

---

## Setup instructions

### Option 1: Docker (recommended)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

From the **repository root** (path may differ on your machine):

```bash
docker compose up --build
```

If your Docker CLI still uses the older plugin name:

```bash
docker-compose up --build
```

Leave this running. First startup may take a few minutes while images build.

**Important:** The UI at port **8080** is **pre-built inside the Docker image**. After you change React/frontend files, rebuild so the browser picks them up:

```bash
docker compose up --build -d
```

(or rebuild only the frontend: `docker compose build frontend --no-cache && docker compose up -d frontend`)

For instant reload while coding, use **Option 2** (`npm run dev` on port **5173**) with the backend running.

**URLs:**

| Service | URL / connection |
|--------|-------------------|
| Frontend (SPA) | [http://localhost:8080](http://localhost:8080) |
| Backend API (direct) | [http://localhost:5000](http://localhost:5000) |
| MySQL (from host) | `localhost:3307` — user `root`, password `root`, database `express_tradecom_assignment_db` |

The browser talks to the API via **`/api`** on port 8080 (Nginx proxies to the backend), matching local development with Vite.

**Default login (created on first successful DB init):**

- Email: `admin@gmail.com`
- Password: `admin@123`

**Production note:** Set a strong `JWT_SECRET_KEY` when deploying (see `.env.example`). Compose defaults to a development secret.

**Stopping:**

```bash
docker compose down
```

---

### Option 2: Manual setup

#### Backend

1. Install Python 3.11+ and MySQL 8 (or run **only** the MySQL service from Compose for a local DB on port **3307**).
2. From the project root:
   ```bash
   python -m venv venv
   ```
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
3. `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set `DB_*` (and `JWT_SECRET_KEY`) for your MySQL instance.
5. `python run.py` — serves the API at **http://localhost:5000**.

#### Frontend

1. `cd frontend`
2. `npm install`
3. Optional: copy `frontend/.env.example` to `frontend/.env` if you need to override `VITE_API_BASE_URL`. By default the app uses **`/api`** and the Vite dev server proxies to **http://127.0.0.1:5000** (see `frontend/vite.config.ts`).
4. `npm run dev` — typically **http://localhost:5173**. Ensure the backend is already running on port **5000**.

---

## Database schema (MySQL)

Table **`users`:**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK, auto-increment) | Primary key |
| `name` | VARCHAR(100) | Full name |
| `email` | VARCHAR(120), unique | Email |
| `role` | VARCHAR(80) | Role (e.g. Admin, Editor, Viewer) |
| `password_hash` | VARCHAR(256) | Bcrypt hash |
| `avatar_url` | TEXT, nullable | Optional image URL |
| `created_at` | DATETIME | UTC creation time |

---

## API endpoints

Base URL when calling the backend directly: **`http://localhost:5000`**.  
When using the Docker frontend or Vite dev proxy, browser requests use the **`/api`** prefix (e.g. `POST /api/login`).

JSON responses use a `success` flag unless noted.

### Authentication

#### Login

- **Method / path:** `POST /login`
- **Body:**
  ```json
  {
    "email": "admin@gmail.com",
    "password": "admin@123"
  }
  ```
- **200:** `{ "success": true, "access_token": "<jwt>", "user": { ... } }`

#### Current user (validate token)

- **Method / path:** `GET /me`
- **Headers:** `Authorization: Bearer <token>`
- **200:** `{ "success": true, "data": { ...user } }`

### Users

#### List users (pagination + search)

- **Method / path:** `GET /users?page=1&limit=3&search=john`
- **Headers:** `Authorization: Bearer <token>`
- **200:** `{ "success": true, "data": { "users": [...], "pagination": { "total", "page", "limit", "pages" } } }`  
  If `page` / `limit` are omitted, the API returns all users in `data.users` (no pagination object).

#### Get user by ID

- **Method / path:** `GET /users/<id>`
- **Headers:** `Authorization: Bearer <token>`
- **200:** `{ "success": true, "data": { ...user } }`
- **404:** User not found

#### Register (create user)

- **Method / path:** `POST /register`
- **Auth:** None (public registration)
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "Editor"
  }
  ```
- **201:** `{ "success": true, "access_token": "<jwt>", "user": { ... }, "data": { ... } }`

#### Delete user

- **Method / path:** `DELETE /users/<id>`
- **Headers:** `Authorization: Bearer <token>`
- **200:** `{ "success": true, "message": "User deleted successfully" }`

---

## Assumptions

- API-first design; responses are JSON unless an error page is returned by the proxy/web server.
- MySQL is the primary datastore.
- Email is unique per user.
- `name`, `email`, and `role` are required for registration; validation is enforced server-side.
- Search matches **name** and **email** (SQL `LIKE`).
- Pagination uses `page` and `limit` query parameters when both are provided.

---

## AI usage declaration

AI tools such as ChatGPT were used as a supportive resource during the 
development of this project & Used to fix errors during the dockerization of an application.
Helped in drafting initial code patterns and improving code readability & Testing.

**Manual Contributions:**
* Core implementation, debugging, and integration of backend APIs were 
performed manually.
* All business logic, API flow, and database interactions were reviewed, 
tested, and refined independently.
* Frontend-backend integration and API testing were carried out manually
* Edge cases, validation handling, and error responses were customized 
and improved beyond initial suggestions.

**Conclusion:**
AI was used as a productivity and learning aid, while the final 
implementation, problem-solving, and project decisions were 
independently handled.
