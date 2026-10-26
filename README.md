# LearnWithFun — Retro Pixel Practice & MongoDB Authentication

LearnWithFun is an interactive learning and speech practice application with a retro pixel aesthetic, interview prep, vocabulary booster, research modes, and full **Node.js + MongoDB Compass** user authentication.

## 🚀 Getting Started

### 1. MongoDB Compass & Local Server
Ensure your local MongoDB instance is running (typically `mongodb://127.0.0.1:27017`).
- Database: `learnwithfun`
- Collection: `users`
- Open **MongoDB Compass**, connect to `mongodb://127.0.0.1:27017`, and you will see the `learnwithfun` database with registered users.

### 2. Run the Node.js Backend Server
In the root directory or inside `server/`:
```bash
npm run server
```
Or inside `server/`:
```bash
cd server
npm start
```
The server will run on `http://localhost:5000` connected to the `learnwithfun` database.

### 3. Run the Frontend (Vite)
In the root directory:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🕹️ Flow & Features
1. **Intro Video**: Fullscreen video intro plays on initial load (with manual replay button in HUD).
2. **Sign-In Card**:
   - **Sign In**: Verifies credentials from the MongoDB database and confirms sign in.
   - **Register**: Creates a new user record in MongoDB Compass (`email`, `password`, `nickname`).
   - **Use without Signing**: One-click guest mode with instant full access.
3. **Nickname & Website Personalization**:
   - Asks for the user's nickname upon sign-in.
   - **User Bar**: Displays user initial, `Welcome, [Nickname]`, and sign-out button.
   - **Mascot Vidhitam**: Addresses the user by nickname during practice sessions.
   - **Performance Reports**: Personalizes analysis reports for the user.

## 🌐 Environment Variables

### Backend (`server/.env`)
See [`server/.env.example`](file:///c:/Users/Dell/OneDrive/Desktop/250780521060/server/.env.example) for reference:
| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Port for the Express server. Cloud hosts like Render assign this automatically. |
| `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/learnwithfun` | MongoDB connection URI. Use MongoDB Atlas connection string in production. |
| `JWT_SECRET` | Yes | `learnwithfun_pixel_secret_key_2026` | Cryptographic secret for signing auth tokens. Set to a strong random key in production. |
| `NODE_ENV` | No | `development` | Set to `production` when deploying to cloud environments. |
| `CORS_ORIGIN` | No | `*` | Allowed origins (e.g. `https://your-frontend.vercel.app` or `*` for open access). |

### Frontend (`.env`)
See [`.env.example`](file:///c:/Users/Dell/OneDrive/Desktop/250780521060/.env.example) for reference:
| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `""` (relative `/api`) | Production URL of your deployed backend (e.g., `https://learnwithfun-backend.onrender.com`). In local dev, leave empty to use Vite proxy. |

## 🚀 Deployment Guide

### Option 1: Frontend on Vercel + Backend on Render / Railway (Recommended)

1. **Deploy Backend (Render / Railway / Fly.io)**:
   - Connect GitHub repo: `https://github.com/Vidhitam-chakole/25070521060-CA-03`
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment Variables:
     - `MONGO_URI`: Your MongoDB Atlas URI (`mongodb+srv://...`)
     - `JWT_SECRET`: Random secure string
     - `NODE_ENV`: `production`
     - `CORS_ORIGIN`: Your Vercel frontend domain or `*`
   - Copy your backend URL (e.g., `https://learnwithfun-backend.onrender.com`).

2. **Deploy Frontend (Vercel)**:
   - Import the repository in Vercel.
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: Your deployed backend URL from step 1 (e.g. `https://learnwithfun-backend.onrender.com`).
   - The included [`vercel.json`](file:///c:/Users/Dell/OneDrive/Desktop/250780521060/vercel.json) automatically handles SPA client-side routing.
