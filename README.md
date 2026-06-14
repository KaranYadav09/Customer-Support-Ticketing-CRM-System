# Customer Support Ticketing CRM

A full-stack web application for managing customer support tickets.

## Tech Stack
- **Backend:** Node.js, Express, SQLite (built-in `node:sqlite`, no extra native deps)
- **Frontend:** React (Vite) + React Router
- **Deployment:** Render (backend) / Vercel (frontend)

## Features
1. **Create Tickets** — customer name/email, subject, description, auto-generated ticket ID & timestamp
2. **List All Tickets** — clean table view with ID, customer, subject, status, date
3. **Search** — live search across name, ticket ID, email, subject, and description
4. **Filter by Status** — Open / In Progress / Closed
5. **View & Update Tickets** — detail page, status updates, and notes/comments

## Database Schema
- **tickets**: id, ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at
- **notes**: id, ticket_id (FK), note_text, created_at

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets?status=&search=` | List/search/filter tickets |
| GET | `/api/tickets/:ticket_id` | Get ticket detail + notes |
| PUT | `/api/tickets/:ticket_id` | Update status and/or add a note |

---

## Project Structure
```
crm2/
├── backend/        Express + SQLite API
│   ├── server.js
│   └── package.json
├── frontend/        React (Vite) app
│   ├── src/
│   ├── vercel.json
│   └── package.json
├── render.yaml      Render deployment config
└── README.md
```

---

## Running Locally

### 1. Backend
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:3001`. The SQLite database file (`tickets.db`) is created automatically.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. The Vite dev server proxies `/api` requests to `http://localhost:3001` automatically (see `vite.config.js`).

---

## Deployment

### Backend → Render
1. Push this repo to GitHub.
2. In Render, create a new **Web Service**, point it at the repo. Render will pick up `render.yaml` automatically (root dir `backend`, build `npm install`, start `npm start`).
3. Render assigns a public URL like `https://support-ticket-crm-api.onrender.com`.
4. **Important:** Render's free tier has an ephemeral filesystem — the SQLite file resets on redeploys/restarts. For persistent data, attach a [Render Disk](https://render.com/docs/disks) and set `DB_PATH` env var to a path on that disk (e.g. `/data/tickets.db`).

### Frontend → Vercel
1. Push this repo to GitHub.
2. In Vercel, import the repo and set the **root directory** to `frontend`.
3. Set environment variable `VITE_API_URL` to your Render backend URL + `/api`, e.g.:
   ```
   VITE_API_URL=https://support-ticket-crm-api.onrender.com/api
   ```
4. Deploy. `vercel.json` handles SPA routing (all routes fall back to `index.html`).

### CORS
The backend has `cors()` enabled for all origins by default, so the Vercel frontend can call the Render API directly. Restrict this in `server.js` (`cors({ origin: 'https://your-frontend.vercel.app' })`) for production hardening.
