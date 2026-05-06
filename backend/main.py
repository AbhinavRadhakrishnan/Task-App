from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="Task Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskBase(BaseModel):
    title: str
    priority: str = "Medium" # High, Medium, Low

class Task(TaskBase):
    id: str
    completed: bool
    created_at: str

tasks_db: List[Task] = []

@app.post("/tasks", response_model=Task)
def create_task(task: TaskBase):
    new_task = Task(
        id=str(uuid.uuid4()),
        title=task.title,
        priority=task.priority,
        completed=False,
        created_at=datetime.utcnow().isoformat()
    )
    tasks_db.insert(0, new_task)
    return new_task

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks_db

@app.put("/tasks/{task_id}", response_model=Task)
def update_task_status(task_id: str, completed: bool):
    for task in tasks_db:
        if task.id == task_id:
            task.completed = completed
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    global tasks_db
    tasks_db = [t for t in tasks_db if t.id != task_id]
    return {"message": "Task deleted successfully"}
