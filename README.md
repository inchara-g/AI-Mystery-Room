#  AI Mystery Room

AI Mystery Room is an AI-powered web application where users can create and solve unique mysteries generated using the Gemini API. Players investigate suspects, discover clues, request hints, and submit their final accusation to solve the case.

##  Features

- Generate unique mysteries using Google Gemini AI.
- Choose difficulty levels: Easy, Medium, and Hard.
- Investigate suspects and discover hidden clues.
- Request AI-generated hints.
- Submit a final accusation and view the result.
- Calculate scores based on investigation performance.

##  Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**AI Integration**
- Google Gemini API

##  Live Demo

[AI Mystery Room](https://ai-mystery-room-inchara-g.vercel.app)

##  Project Structure

```text
AI-Mystery-Room/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── server.js
│   └── package.json
└── README.md
```

##  Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/inchara-g/AI-Mystery-Room.git
cd AI-Mystery-Room
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
node server.js
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

##  Environment Variables

Replace the placeholder values with your own MongoDB connection string and Gemini API key. Never upload `.env` files or expose API keys publicly.

##  Project Goal

The goal of AI Mystery Room is to combine artificial intelligence and interactive investigation to create an engaging mystery-solving experience.

---

**Developed as an AI-powered web application using the MERN stack and Gemini API.**
