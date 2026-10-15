<h1 align="center">💸 Wallet - Expense Tracker 🚀</h1>


This isn't just a front-end app — it's a **complete mobile application** with backend integration, authentication, and cloud-based storage.

## 🧑‍🍳 App Features Overview

- 🔐 **Authentication** with email verification using **Clerk**
- 📝 **Signup & Login** flows with 6-digit email code
- 🏠 **Home Screen** that shows your current balance & past transactions
- ➕ **Create Screen** to add **income** or **expense** transactions
- 🔄 **Pull to refresh** functionality from scratch
- 🗑️ **Delete transactions** to update balance
- 🚪 **Logout** to navigate back to login screen

---

## 🧠 What I have Learned

- ⚙️ Build and deploy an **Express API** with **PostgreSQL** using **Neon**
- 🔐 Implement authentication & email verification with **Clerk**
- 📲 Build a full mobile app with **React Native & Expo**
- 🧵 Manage state and navigation using **React Navigation**
- 🛡️ Understand and apply **Rate Limiting** using **Redis**

---

## 📁 .env Setup

### ⚙️ Backend (`/backend`)

```bash
PORT=5001
NODE_ENV=development

DATABASE_URL=<your_neon_postgres_connection_url>

# Upstash Redis (required by backend/src/config/upstash.js)
UPSTASH_REDIS_REST_URL=<your_upstash_redis_rest_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_redis_rest_token>

# Cron Keep-Alive ping (used in production)
API_URL=http://localhost:5001/api/health

CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
```

### 📱 Mobile (`/mobile`)

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_key>
```

## ⚙️ Run the backend

```bash
cd backend
npm install
npm run dev

```

## 📱 Run the mobile

```bash
cd mobile
npm install
npx expo start
```
