# JojoSpeed (Fast-like speed test) — Render FREE

JojoSpeed is a minimalist, tech-styled speed test web app (red/black), inspired by fast.com:
- Download Mbps (most reliable in browsers)
- Upload Mbps
- Ping + Jitter

## Project structure
- `api/`  Node/Express API (ping/download/upload)
- `web/`  Static site (HTML/CSS/JS)
- `render.yaml` Deploy both on Render via Blueprint

## Local run (optional)
### 1) API
```bash
cd api
npm install
npm start
```
API runs on http://localhost:3000

### 2) Web
Serve the static files in `web/public/` (any static server).
Quick option (Node):
```bash
npx serve web/public
```

Then open the URL shown by `serve`.

## Deploy on Render (free)
### A) Create repo
Upload this project to your GitHub repository.

### B) Deploy with Blueprint
1. On Render: **New** → **Blueprint**
2. Select your repo
3. Render reads `render.yaml` and creates:
   - `jojospeed-api` (Web Service)
   - `jojospeed` (Static Site)

### C) Link the frontend to the API
After the API is deployed, copy its URL (example):
`https://jojospeed-api.onrender.com`

Edit:
`web/public/config.js`
and set:
```js
window.JOJO_API_BASE = "https://jojospeed-api.onrender.com";
```

Commit + push → Render auto-deploys the static site.

## Free-tier note
Render free Web Services can spin down after inactivity.
JojoSpeed frontend performs a "wake" request automatically before starting tests.
