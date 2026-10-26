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
