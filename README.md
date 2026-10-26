# SpeechPact — Retro Pixel Practice & MongoDB Authentication

SpeechPact is an interactive speech practice application with a retro pixel arcade aesthetic, interview prep, vocabulary booster, research modes, and full **Node.js + MongoDB Compass** user authentication.

## 🚀 Getting Started

### 1. MongoDB Compass & Local Server
Ensure your local MongoDB instance is running (typically `mongodb://127.0.0.1:27017`).
- Database: `speechpact`
- Collection: `users`
- Open **MongoDB Compass**, connect to `mongodb://127.0.0.1:27017`, and you will see the `speechpact` database with registered users.

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
The server will run on `http://localhost:5000` with live MongoDB Compass connection status.

### 3. Run the Frontend (Vite)
In the root directory:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🕹️ Flow & Features
1. **Intro Video**: Fullscreen video intro plays on initial load (with manual replay button in HUD).
2. **Pixelated Sign-In Card**:
   - **Sign In**: Verifies credentials from the MongoDB database and confirms sign in.
   - **Register**: Creates a new user record in MongoDB Compass.
   - **Use without Signing**: One-click guest mode with instant full access.
   - **Live MongoDB Ping**: Shows real-time connection status to MongoDB Compass.
3. **Nickname & Website Customization**:
   - Asks for the user's nickname/codename upon sign-in.
   - **Player HUD**: Displays retro avatar, `PLAYER 1: [Nickname]`, and MongoDB status.
   - **Hero Stage**: Customizes headers to `[NICKNAME]'S STAGE`.
   - **Mascot Vidhitam**: Addresses the user by nickname during speech practice.
   - **Speech Analysis**: Personalizes speaker performance reports for the user.

