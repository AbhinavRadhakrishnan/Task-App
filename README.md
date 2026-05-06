# Task Board App

A modern, full-stack Task Board application built with React, FastAPI, and Tailwind CSS. The app features task management with a priority-based color-coding system, real-time filtering, search capabilities, and a responsive design.

## Features

- **Task Management**: Create, read, update (complete/uncomplete), and delete tasks.
- **Priority System**: Assign priorities (High, Medium, Low) to tasks.
- **Color-Coding**: Visual priority indicators (Red for High, Amber for Medium, Emerald for Low).
- **Filtering & Search**: Quickly find tasks by searching titles or filtering by status (All, Active, Completed).
- **Progress Tracking**: A dynamic progress bar showing the percentage of completed tasks.
- **Optimistic UI Updates**: Instant feedback on the frontend for a snappy user experience.

## Tech Stack

### Frontend
- **React 19** with **Vite** for fast development and building.
- **Tailwind CSS 4** for styling and responsive design.
- **Axios** for API communication.
- **Lucide React** for beautiful icons.

### Backend
- **FastAPI** for a fast, modern REST API.
- **Pydantic** for data validation.
- **Uvicorn** for running the ASGI server.
- In-memory data store for quick setup.

## Prerequisites

- Node.js (v18+ recommended)
- Python (3.8+ recommended)

## Getting Started

### 1. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn main:app --reload
```
The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install the dependencies:
```bash
npm install
```

Run the frontend development server:
```bash
npm run dev
```
The frontend will typically be accessible at `http://localhost:5173` (check the terminal output for the exact URL).

## API Endpoints

The FastAPI backend exposes the following RESTful endpoints:

- `GET /tasks` - Retrieve all tasks.
- `POST /tasks` - Create a new task (expects `title` and `priority`).
- `PUT /tasks/{task_id}` - Update a task's completion status.
- `DELETE /tasks/{task_id}` - Delete a task.

You can view the interactive API documentation (Swagger UI) by visiting `http://localhost:8000/docs` while the backend server is running.

## Folder Structure

```
Task App/
├── backend/
│   ├── main.py              # FastAPI application and routes
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main React component
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Tailwind directives and global styles
    ├── package.json         # Node.js dependencies and scripts
    └── vite.config.js       # Vite configuration
```
