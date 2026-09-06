# Happy Birthday — A Cinematic Experience (Full-Stack React + FastAPI)

A production-ready full-stack web application converted from an existing cinematic HTML/CSS/JavaScript experience into a modular **React 18 + Vite** frontend and a **Python FastAPI + SQLAlchemy** backend with persistent database storage.

---

## 🌟 Overview & Features

### 🎬 Visual Aesthetics & Design
- **Cinematic Dark Theme**: Deep midnight palette (`#03020a`, `#07050f`, `#0f0c1a`) with rich 24k gold gradients (`#c9922a`, `#e8b84b`, `#f5d07a`) and rose pink accents.
- **Custom Golden Glowing Cursor**: Trailing cursor with spring physics.
- **Film Grain & Letterboxing**: Authentic retro film leader countdown, SVG fractal noise grain overlay, cinematic letterbox bars, and vignette.
- **Dynamic Canvases**: Twinkling starry sky with mouse parallax, flowing aurora borealis canvas, particle fireworks, and interactive birthday cake.
- **4 Theme Switcher**: Gold Classic, Rose Garden, Midnight Blue, and Emerald Isle.

### ✨ Interactive Modules
1. **Film Leader Countdown (5 to 1)**: Retro film flicker countdown with skip intro capability.
2. **Typewriter Intro Sequence**: Multi-scene atmospheric story opener leading to title reveal.
3. **Web Audio Synthesizer**: Ambient Cm(add9) chord generator with convolution reverb and animated equalizer visualizer bars.
4. **Director Mode**: Live in-place editing for story titles, descriptions, quotes, and credits with direct database persistence.
5. **Story Scenes (01-04)**: Alternating layout with golden corner brackets, interactive photo frames, upload support, and modal lightbox.
6. **3D Flip Cards**: 6 perspective flip cards with hover/tap animations for reasons why the recipient is amazing.
7. **Friendship Timeline**: Vertical milestone tracker with glowing chapter markers (Ch. I - Ch. V).
8. **Draggable Polaroid Wall**: 8 floating polaroids with rotation, physics-based dragging, and instant photo upload.
9. **3D Photo Gallery**: 16 memory cards with 3D mouse parallax tilt, hover sheen, and 7 CSS filters (Original, Sepia, Noir, Golden Hour, Vivid, Dreamy, Moonlight).
10. **Interactive Cake Canvas**: Blow out 6 candles by clicking on their flames to trigger smoke, confetti, and wish fulfillment.
11. **Surprise Gift Box**: 3D present box with animated lid opening, confetti blast, and hidden message.
12. **Live Floating Wish Wall**: Real-time floating message arena with instant input and backend persistence.
13. **Memory Map (SVG World Map)**: Interactive world map with pulsating gold pins and coordinate tooltips.
14. **Secret Code & Love Letter**: Passcode verification unlocking a parchment letter typed out with live typewriter animation.
15. **Handwritten Signature**: Scroll-triggered cursive gold handwriting animation using SVG path dashoffset interpolation.
16. **Birthday Card Generator**: Dynamic canvas generator with custom recipient name, style cycler, and PNG download.
17. **Grand Finale & Fireworks**: Particle physics fireworks engine with floating hearts and confetti explosion.
18. **End Credits Roll**: Hollywood-style vertical credits scroll.
19. **Achievement System**: Dynamic floating toast notifications rewarding user interactions.

---

## 🏗️ Architecture

```text
                    USER
                     │
                     ▼
        ┌─────────────────────────┐
        │ React 18 + Vite (SPA)   │
        │ Port: 5173              │
        └────────────┬────────────┘
                     │ HTTP / REST API
                     ▼
        ┌─────────────────────────┐
        │ FastAPI Backend         │
        │ Port: 8000              │
        └────────────┬────────────┘
                     │ SQLAlchemy ORM
                     ▼
        ┌─────────────────────────┐
        │ SQLite / PostgreSQL DB  │
        └─────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ (tested with v24.15.0)
- **Python**: 3.10+ (tested with 3.12.10)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# (Optional) Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://127.0.0.1:8000` (Interactive API Docs: `http://127.0.0.1:8000/docs`).

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be accessible at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & service status |
| `GET` | `/api/content` | Fetch all customized Director Mode texts |
| `PUT` | `/api/content` | Save & update Director Mode story content |
| `GET` | `/api/wishes` | Get submitted birthday wishes |
| `POST` | `/api/wishes` | Submit a new wish to the live wall |
| `DELETE` | `/api/wishes/{id}` | Delete a wish |
| `GET` | `/api/photos` | List all uploaded gallery & scene photos |
| `POST` | `/api/photos/upload` | Upload & persist a photo memory |
| `GET` | `/api/map-pins` | Fetch interactive memory map pins |
| `POST` | `/api/map-pins` | Add a new memory location pin |
| `POST` | `/api/secret/verify` | Verify passcode and retrieve secret love letter |
| `GET` | `/api/cards` | Get saved generated cards |
| `POST` | `/api/cards/save` | Save a newly generated birthday card |

---

## 📂 Project Structure

```text
DHANYA/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── endpoints.py
│   │   ├── __init__.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── intro/
│   │   │   ├── modals/
│   │   │   ├── navigation/
│   │   │   └── sections/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── birthday-movie-trailer.html (Original Reference)
└── README.md
```
