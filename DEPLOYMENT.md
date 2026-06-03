Deployment Guide
================

This repository contains three deployable parts:

- Backend API (Node.js / Express) — folder: `backend`
- Admin panel (React) — folder: `admin-panel`
- Mobile app (Expo / React Native) — folder: `mobile`

This guide covers recommended hosting and step-by-step commands to deploy.

1) Backend — Render (Docker)
----------------------------
Files added:
- `backend/Dockerfile`
- `render.yaml` (manifest you can adapt)

Recommended steps:
- Push your repo to GitHub (or connect your existing remote).
- Go to https://render.com and "New -> Web Service".
- Choose "Docker" as environment and connect your GitHub repo.
- Set the Dockerfile path to `backend/Dockerfile`.
- Set environment variables (render dashboard -> Environment):
  - `MONGO_URI` — your MongoDB connection string
  - `JWT_SECRET` — a strong secret
  - `JWT_EXPIRE` — optional (e.g. `30d`)
  - `NODE_ENV=production`
  - `CLOUDINARY_*` and other keys if used in production
- (Optional) Set health check URL to `/health`.
- Deploy; Render will build the Dockerfile and run the container.

Notes:
- The Dockerfile uses `npm ci --only=production` to install prod deps.
- Uploads are stored in `uploads/`; for production consider using Cloudinary or S3 and set related env variables.

2) Admin Panel — Vercel
-----------------------
The admin panel is a CRA app in `admin-panel`.

Steps:
- Login to https://vercel.com and "New Project" → import your GitHub repo.
- Set the project root to `admin-panel`.
- Set environment variable `REACT_APP_API_URL` to your backend URL (e.g., `https://api.yourdomain.com/api`).
- Build & Output settings: Vercel will detect `npm run build`.
- Deploy.

3) Mobile App — Expo EAS builds
-------------------------------
We use Expo's EAS build system. The repo already contains `eas.json`.

Prerequisites:
- Install EAS CLI: `npm install -g eas-cli` or `npx eas-cli`
- Create an Expo account and login: `eas login`
- Configure credentials for Play Store / App Store when prompted.

Build steps (Android AAB recommended):

```bash
cd mobile
eas build --platform android --profile production
```

This will produce an AAB you can upload to Google Play. For iOS, follow EAS prompts (requires Apple developer account).

Submit to stores (optional):

```bash
eas submit --platform android --latest
```

4) DNS & SSL
------------
- Point your domain to the backend (Render gives a generated domain); enable HTTPS in Render.
- Point your admin panel domain to Vercel and enable HTTPS.

5) CI / Secrets
---------------
- Store secrets in Render (backend), Vercel (admin), and EAS secrets (for mobile) as needed.

6) Smoke tests
--------------
- Verify `GET /health` on the backend returns `OK`.
- Open admin panel and ensure it talks to the backend.
- Install the Android APK / open the EAS build and verify login works.

If you'd like, I can:
- Create a GitHub Actions workflow to build and push images (or automatically deploy to Render).
- Fill `render.yaml` with your repository URL and preferred region if you provide them.
- Start EAS build for you (requires Expo credentials and access).

*** End of guide
