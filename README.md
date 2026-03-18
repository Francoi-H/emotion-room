# Emotion Room

A full-stack web application where users select a mood and the system generates
a procedural animated WebGL environment that represents that emotion.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Three.js, Vite            |
| Backend   | Node.js 20+, Express 4              |
| Database  | PostgreSQL 15+                      |
| Auth      | JWT (HttpOnly cookie), bcrypt       |

---

## Project Structure

```
emotion-room/
├── client/                   # React + Three.js frontend (Vite)
│   └── src/
│       ├── api/              # Axios API client
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth context / provider
│       ├── lib/              # Three.js scene engine + emotion params
│       ├── pages/            # Route-level page components
│       └── styles/           # Global CSS
├── server/                   # Express backend
│   ├── middleware/           # Auth guard, error handler
│   ├── models/               # Emotion parameter maps
│   ├── routes/               # auth.js, environments.js
│   ├── db.js                 # PostgreSQL connection pool
│   └── server.js             # Entry point
└── database/
    └── schema.sql            # PostgreSQL schema
```

---

## Quick Start

### 1 — Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 2 — Database

```bash
createdb emotionroom
psql -d emotionroom -f database/schema.sql
```

### 3 — Backend

```bash
cd server
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET

npm install
npm run dev
# → http://localhost:4000
```

### 4 — Frontend

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api/*` to `localhost:4000` automatically.

---

## Environment Variables (server/.env)

| Variable         | Description                                        |
|------------------|----------------------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string                       |
| `JWT_SECRET`     | Random secret ≥ 32 characters                     |
| `PORT`           | Server port (default: 4000)                        |
| `CLIENT_ORIGIN`  | Frontend origin for CORS (default: localhost:5173) |
| `NODE_ENV`       | `development` or `production`                      |

---

## API Reference

### Auth

| Method | Path                  | Auth | Description          |
|--------|-----------------------|------|----------------------|
| POST   | `/api/auth/register`  | —    | Create account       |
| POST   | `/api/auth/login`     | —    | Sign in              |
| POST   | `/api/auth/logout`    | —    | Clear session cookie |
| GET    | `/api/auth/me`        | ✓    | Get current user     |

### Environments

| Method | Path                              | Auth    | Description              |
|--------|-----------------------------------|---------|--------------------------|
| GET    | `/api/environments/defaults`      | —       | All emotion defaults     |
| GET    | `/api/environments/defaults/:e`   | —       | Single emotion defaults  |
| POST   | `/api/environments`               | ✓       | Save a scene             |
| GET    | `/api/environments`               | ✓       | List your scenes         |
| GET    | `/api/environments/:id`           | owner/— | Load a scene             |
| PATCH  | `/api/environments/:id`           | ✓ owner | Update a scene           |
| DELETE | `/api/environments/:id`           | ✓ owner | Delete a scene           |

---

## Emotion Parameters

Each emotion maps to a set of visual parameters that drive the Three.js scene:

| Parameter        | Type    | Description                              |
|------------------|---------|------------------------------------------|
| `waveSpeed`      | float   | Speed of particle and wave movement      |
| `particleCount`  | int     | Number of particles in the scene         |
| `particleSize`   | float   | Size of each particle point              |
| `colorPalette`   | string[]| Array of 5 hex colour strings            |
| `bgColor`        | string  | Scene background/fog colour              |
| `lightIntensity` | float   | Tone-mapping exposure drive              |
| `cameraMotion`   | float   | Amplitude of camera drift                |
| `distortionLevel`| float   | Visual distortion (future shader use)    |
| `bloomStrength`  | float   | Post-processing bloom intensity          |
| `fogDensity`     | float   | Exponential fog density                  |
| `waveAmplitude`  | float   | Height of wave deformations              |
| `rotationSpeed`  | float   | Particle system rotation speed           |
| `glitchIntensity`| float   | Camera shake / glitch magnitude          |
| `trailLength`    | float   | Motion blur / trail persistence (0–1)    |

---

## Features

- ✅ User registration, login, logout with secure HttpOnly JWT cookies
- ✅ Six emotion presets: calm · focus · joy · chaos · melancholy · wonder
- ✅ Real-time WebGL scene driven by emotion parameters
- ✅ Live controls panel — sliders and colour pickers update the scene instantly
- ✅ Save scenes with custom names to your account
- ✅ Toggle scenes public/private
- ✅ Shareable scene URLs (`/scene/:id`)
- ✅ Full-screen immersive landing page with emotion preview
- ✅ Responsive, production-grade UI

---

## Extending

**Add a new emotion**: Add an entry to `EMOTION_DEFAULTS` in both
`server/models/emotionParams.js` and `client/src/lib/emotionParams.js`,
and add the key to the `CHECK` constraint in `database/schema.sql`.

**Add a new visual parameter**: Add it to `PARAM_CONFIG` in
`client/src/lib/emotionParams.js` and wire it up in
`client/src/lib/EmotionScene.js` inside `_update()`.

**Post-processing (bloom, glitch shaders)**: Integrate
`three/examples/jsm/postprocessing/EffectComposer.js` and
`UnrealBloomPass` — the `bloomStrength` parameter is already plumbed
through to be ready for this.
