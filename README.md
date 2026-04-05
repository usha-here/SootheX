<br />

```
███████╗ ██████╗  ██████╗ ████████╗██╗  ██╗███████╗██╗  ██╗
██╔════╝██╔═══██╗██╔═══██╗╚══██╔══╝██║  ██║██╔════╝╚██╗██╔╝
███████╗██║   ██║██║   ██║   ██║   ███████║█████╗   ╚███╔╝ 
╚════██║██║   ██║██║   ██║   ██║   ██╔══██║██╔══╝   ██╔██╗ 
███████║╚██████╔╝╚██████╔╝   ██║   ██║  ██║███████╗██╔╝ ██╗
╚══════╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

## ✨ What is SootheX?

SootheX is a full-stack conversational AI assistant built with React and Node.js. It provides a calm, responsive chat interface powered by an AI language model — designed to feel natural, fast, and helpful. Whether you're asking questions, getting information, or just having a conversation, SootheX is built to respond intelligently.

> **Deployed at:** [soothex](https://soothex.onrender.com/) 
---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Minimum Version | Check with |
|------|----------------|------------|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Git | any | `git --version` |

You'll also need an **AI API key** (see [Environment Variables](#-environment-variables) below).

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/usha-here/SootheX
cd SootheX
```

**2. Set up the backend**

```bash
cd backend
npm install
```

**3. Configure environment variables**

```bash
# Still inside /backend
cp .env.example .env
# Now open .env in your editor and add your API key (see section below)
```

**4. Start the backend server**

```bash
npm run dev
# Server starts on http://localhost:5000
```

**5. Set up the frontend** *(open a new terminal tab)*

```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

**6. Open the app**

Visit [http://localhost:5173](http://localhost:5173) in your browser. The frontend will proxy API requests to the backend automatically.

---

## 🔑 Environment Variables

Create a `.env` file inside the `/backend` folder. **Never commit this file to Git.**

```env
# ─── AI Service ──────────────────────────────────────────────────────────────
# Your API key from the AI provider you're using.
# Get one at: https://platform.openai.com/api-keys
AI_API_KEY=sk-your-api-key-here

# The AI model to use (change this based on your provider)
# Examples: gpt-4o | gpt-3.5-turbo | gemini-pro | claude-3-5-sonnet-20241022
AI_MODEL=gpt-4o

# ─── Server ──────────────────────────────────────────────────────────────────
PORT=5000

# ─── Frontend Origin (for CORS) ──────────────────────────────────────────────
# In development, this is your Vite dev server
CLIENT_URL=http://localhost:5173
```

> **Where to get an API key:**
> - [OpenAI](https://platform.openai.com/api-keys) — GPT-4o, GPT-3.5-turbo
> - [Google AI Studio](https://aistudio.google.com/app/apikey) — Gemini Pro (free tier available)
> - [Anthropic Console](https://console.anthropic.com/) — Claude models

A `.env.example` file is included in `/backend` as a safe template (no real keys — just variable names).

---

## 📁 Project Structure

```
SootheX/
│
├── backend/                    # Node.js + Express API server
│   ├── src/
│   │   ├── routes/
│   │   │   └── chat.js         # POST /api/chat endpoint
│   │   ├── controllers/
│   │   │   └── chatController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── index.js            # Express app entry point
│   ├── .env                    # ← YOU CREATE THIS (not committed)
│   ├── .env.example            # Safe template — committed to Git
│   └── package.json
│
├── frontend/                   # React single-page application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx  # Main conversation UI
│   │   │   ├── MessageBubble.jsx
│   │   │   └── InputBar.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js      # Chat state & API call logic
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔌 API Reference

### `POST /api/chat`

Sends a user message and returns the assistant's response.

**Request body:**
```json
{
  "message": "What's the weather like today?",
  "history": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi! How can I help you today?" }
  ]
}
```

**Success response** `200 OK`:
```json
{
  "reply": "I don't have access to real-time weather data, but I can help you find a weather service!"
}
```

**Error response** `500`:
```json
{
  "error": "Failed to get response from AI service"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI & state management |
| Frontend | Vite | Build tool & dev server |
| Backend | Node.js 18 | JavaScript runtime |
| Backend | Express.js | API routing & middleware |
| AI | OpenAI / Gemini | Language model responses |
| Deployment | Vercel + Render | Frontend + backend hosting |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# From the /frontend directory
npx vercel
# Follow the prompts — Vercel auto-detects Vite
```

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Add environment variables from your `.env` in the Render dashboard
5. Set **Start Command** to `npm start`
---

## 📄 Features

1. Secure Login/signup using JWT and bycrypt.
2. Allow users to customize their avatars easily adding a touch of individuality and comfort to their virtual interactions.
3. Gemini AI was  implemented in such a way that it offers a  diverse set of over 150 smart replies that are dynamic and empathetic in nature and feel as close as possible to a human conversation
4. It provides various on demand services like providing mental health tips, opening search engine and websites using voice command .

---
📄 License
Made By USHA NITWAL

⭐ Star this repo if you found it useful!

</div>
