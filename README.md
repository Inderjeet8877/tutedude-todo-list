# MERN To-Do List Application

A beautiful, modern, fully functional To-Do List application built with the MERN stack (MongoDB, Express.js, React, Node.js). 

## Technologies Used
- **Backend:** Node.js, Express.js, mongoose, dotenv, cors
- **Frontend:** React, Vite, Axios, Tailwind CSS, Framer Motion, lucide-react (Icons)
- **Database:** MongoDB

## Project Structure
- `backend/` - Contains the Express.js API, MongoDB schemas, and controllers.
- `frontend/` - Contains the React Vite application.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (update backend `.env` file)

### Backend Setup
1. Open terminal and nagivate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. The `.env` file has been provided with a default `MONGO_URI`. If you are using MongoDB Atlas, replace it with your Atlas connection string.
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mern-todo
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:5000.*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open on http://localhost:5173.*

## Key Features Implemented
- **Create Tasks:** Added ability to add a task with title and description.
- **View Tasks:** Beautiful list display with a soft, glassmorphic UI.
- **Update Status:** Easily toggle tasks between pending and completed states by clicking the circle indicator.
- **Delete Tasks:** Remove unwanted tasks using the Trash icon.
- **Search (API logic included):** Use the search bar to dynamically fetch tasks based on keyword!

## Challenges & Solutions
1. **Interactive Prompt Blocking Install:** When using modern `create-vite`, it prompts "Install and start now?". This disrupted chained automated commands, requiring a specific exit/interrupt to proceed with manual tailored dependencies. I addressed this by manually initiating the `npm install` procedure after the project scaffolding was created.
2. **UI Polish within a Single Component:** Integrating API responses to a fluid interface with TailwindCSS was done carefully. The application leverages a nice glassmorphism effect using pseudo-utility classes (`.glass-panel`) in `index.css`.
3. **Optimized Search Hook:** Used a debounced effect in the React `useEffect` for the search system to prevent overloading the backend with an excessive number of API calls on every keystroke. 

## Endpoints (Backend)
- `GET /api/tasks?keyword=...` - Fetch all tasks or search tasks by keyword.
- `POST /api/tasks` - Create a new task.
- `PUT /api/tasks/:id` - Update an existing task (title, description, status).
- `DELETE /api/tasks/:id` - Delete an existing task.
