# TourMate

A full-stack Airbnb clone with separate frontend and backend services.

## Project Structure

```
airbnb-2/
├── frontend/          # React frontend with Vite
├── backend/           # Express.js API server
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd airbnb-2
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URL=mongodb://127.0.0.1:27017/tourmate
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Running the Application

1. **Start Backend** (from backend directory)
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

2. **Start Frontend** (from frontend directory)
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001` and the frontend on `http://localhost:5173`.

## Development

- Frontend: `npm run dev` in frontend/
- Backend: `npm run dev` in backend/
- Both services can be developed independently
