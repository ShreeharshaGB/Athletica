# Athletica

Athletica is an AI-powered fitness companion designed for students and educational institutions.

## Tech Stack Foundation

- **Frontend**: React + Vite
- **Backend**: Node.js + Express (ES Modules)
- **Database**: MongoDB Atlas (planned)
- **AI**: Gemini API (planned)

## Project Structure

```text
athletica/
├── frontend/        # React + Vite application
├── backend/         # Node.js + Express API server
│   └── src/
│       └── server.js # Express server with GET /api/health endpoint
├── docs/            # Project documentation directory
├── .gitignore       # Root Git ignore rules
└── README.md        # Project documentation
```

## Setup & Scaffolding Commands

### Backend API Server
```bash
cd backend
npm install
npm run dev   # Runs Node with --watch src/server.js
# or npm start
```
Health Check Endpoint: `GET http://localhost:5000/api/health`

### Frontend Application
```bash
cd frontend
npm install
npm run dev   # Starts Vite development server
```
