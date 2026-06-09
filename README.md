# TourMate

A full-stack travel & stay booking platform with separate frontend and backend services.

## Project Structure

```
tourmate/
├── Backend/               # Express.js API server
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routers/           # Express routers
│   ├── middlewares/        # Auth & validation middleware
│   ├── utility/           # Helper functions
│   ├── uploads/           # User-uploaded files
│   ├── server.js          # App entry point
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
├── frontend/              # React frontend with Vite
│   ├── client/src/        # React source code
│   │   ├── app/           # Redux store config
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── features/      # Feature slices (auth, homes)
│   │   ├── layout/        # Layout components
│   │   ├── pages/         # Page components
│   │   ├── routes/        # App routing
│   │   ├── store/         # Redux slices
│   │   └── utils/         # API client & helpers
│   ├── index.html         # Entry HTML
│   ├── vite.config.js     # Vite build config
│   ├── tailwind.config.js # Tailwind CSS config
│   ├── postcss.config.js  # PostCSS config
│   └── package.json       # Frontend dependencies
├── package.json           # Root scripts (run both services)
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
   cd tourmate
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URL=mongodb://127.0.0.1:27017/tourmate
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Running the Application

**From the project root** (recommended):
```bash
# Start frontend dev server
npm run dev

# Start backend server
npm run start
```

**Or from individual directories:**

1. **Start Backend** (from Backend/ directory)
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

2. **Start Frontend** (from frontend/ directory)
   ```bash
   npm run dev
   ```

The backend runs on `http://localhost:3001` and the frontend on `http://localhost:5173`.

## Deployment

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Add environment variables in Vercel dashboard

### Backend (Render / Railway)
- **Root Directory**: `Backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Add environment variables in the hosting dashboard

## Development

- Frontend: `npm run dev` from root or `frontend/`
- Backend: `npm run start` from root or `npm run dev` in `Backend/`
- Both services can be developed independently
