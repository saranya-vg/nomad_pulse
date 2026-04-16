# 🌍 NomadPulse AI

NomadPulse AI is a conversational web app that helps users discover nearby places (cafes, services, etc.) using natural language. It combines AI (OpenRouter) with Google Places API to deliver context-aware, location-biased results.

Check out the youtube video here:

> **[Watch the Demo on YouTube]([https://youtu.be/4sr02NGxJeQ](https://youtu.be/TUR57t7O0uo)**

---

## 📁 Project Structure

```
nearby-helper-pro/
│
├── backend/
│   ├── server.js              # Express server (API + AI + Google Places)
│   ├── package.json           # Backend dependencies
│   ├── .env                   # API keys (not committed)
│
├── frontend/
│   ├── index.html             # Main UI
│
├── README.md
```

---

## ⚙️ Prerequisites

Make sure you have:

* Node.js (v16 or above)
* npm (comes with Node)
* OpenRouter API key
* Google Places API key

---

## 🔑 Environment Setup

Create a `.env` file inside the `backend/` folder:

```
OPENROUTER_KEY=your_openrouter_api_key
GOOGLE_KEY=your_google_places_api_key
```

---

## 🚀 Execution Steps

### 1. Clone / Extract Project

```bash
cd nearby-helper-pro
```

---

### 2. Start Backend Server

```bash
cd backend
npm install
node server.js
```

✅ Backend will run at:

```
http://localhost:3000
```

---

### 3. Run Frontend

Option 1 (Simple):

```bash
cd frontend
open index.html
```

Option 2 (Recommended - VS Code Live Server):

* Install "Live Server" extension
* Right-click `index.html`
* Click **"Open with Live Server"**

Or just double click on the html file from your file explorer.

---

## 💡 How It Works

1. User enters a query:

   ```
   "cafes near Guindy"
   ```

2. Frontend sends:

   * Query (`q`)
   * Chat history (`history`)

3. Backend:

   * Sends request to OpenRouter AI
   * Extracts structured place data
   * Queries Google Places API for real details

4. Response includes:

   * Places (name, rating, image, address)
   * OR conversational reply
   * UI theme

---

## 🧠 Features

* 💬 Conversational search interface
* 🧠 Chat history (context-aware AI)
* 📍 Location-biased results (e.g., Chennai)
* 🖼️ Place images + ratings + addresses
* 🎨 Dynamic UI themes based on AI response

---

## ❗ Common Issues & Fixes

### ⚠️ "Offline" Error

* Ensure backend is running
* Check `.env` API keys
* Confirm correct API endpoint (`POST /search`)

---

### 🌎 Random International Locations

* Fixed by biasing search:

  ```
  p.name + " Chennai"
  ```
* Can be improved with:

  * User-specified areas (Guindy, Porur, etc.)
  * Lat/Lng-based search

---

### 🔌 CORS Errors

Install and use CORS middleware in backend:

```bash
npm install cors
```

---

## 🔥 Future Improvements

* 📍 GPS-based nearby detection
* 🎨 Improved UI (cards, animations, loaders)
* 🧠 Persistent memory (user preferences)
* 🔎 Filters (rating, distance, price)
* 📱 Mobile responsiveness

---

## 🧑‍💻 Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* AI: OpenRouter (LLM)
* Maps: Google Places API

---

## 📌 Notes

* This app does NOT use device GPS (by design)
* Location context is inferred from query + backend bias
* Works best when area is explicitly mentioned

---

## 🚀 Summary

NomadPulse transforms local search into a **chat-driven experience**, combining AI reasoning with real-world place data for smarter recommendations.

---
