"""
Simple FastAPI Starter - TODO API
==================================

This is a minimal FastAPI example, designed for beginners.
It shows the basic structure of a REST API with database access.

HOW IT WORKS:
1. Client (your React app) makes a request to a URL (e.g., /todos)
2. FastAPI finds the function decorated with @app.get("/todos")
3. That function uses the database connection to query data
4. The function returns data, which FastAPI converts to JSON
5. The JSON is sent back to the client
"""

# Step 1: Import what we need
# os - Access environment variables
import os

# datetime - Handle timestamps
from datetime import datetime

# List, Optional - Type hints for function parameters
from typing import List, Optional

# dotenv - Load environment variables from .env file
from dotenv import load_dotenv

# FastAPI - The web framework
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker

from models import Base, Todo

# Step 2: Load environment variables from .env file
# Looks for .env file in current directory and parent directories
load_dotenv()

# Step 3: Connect to the database
# Get DATABASE_URL from environment variable, fallback to local development
# Format: postgresql+asyncpg://username:password@host:port/database_name
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database engine - this manages the connection pool
# Think of it as a "factory" that creates database connections
engine = create_async_engine(DATABASE_URL, echo=False)

# Create a session factory - this creates individual database sessions
# Each request will get its own session to query the database
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


# Step 4: Create a function to get database sessions
# This is called a "dependency" - FastAPI will automatically call this
# for each request and pass the result to your endpoint functions
async def get_db():
    """
    Generator function that yields a database session.

    The 'yield' keyword is special - it:
    1. Creates a session when the function is called
    2. Gives it to your endpoint function
    3. Closes the session when the endpoint finishes

    This ensures database connections are properly cleaned up.
    """
    async with AsyncSessionLocal() as session:
        yield session  # Give the session to the endpoint
        # After the endpoint finishes, the session is automatically closed


# Step 5: Define what our API requests and responses will look like
# These are called "Pydantic models" or "schemas"
# They define the structure of data that will be sent to and from the API


class TodoBase(BaseModel):
    """Base schema with common fields for todos"""

    title: str
    description: Optional[str] = None
    completed: bool = False


class TodoCreate(TodoBase):
    """Schema for creating a new todo"""

    pass


class TodoUpdate(BaseModel):
    """Schema for updating a todo - all fields optional"""

    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(TodoBase):
    """What a todo looks like when we send it back to the client"""

    id: int
    created_at: datetime
    updated_at: datetime

    # This tells Pydantic to automatically convert SQLAlchemy models
    # (like our Todo model) into this Pydantic model
    class Config:
        from_attributes = True


# Step 6: Create the FastAPI app
# This is the main application object - it handles all incoming requests
app = FastAPI(title="TODO API", description="A simple CRUD API for managing TODO items")


# Step 7: Create database tables on startup
# This automatically creates all tables defined in your SQLAlchemy models
@app.on_event("startup")
async def create_tables():
    """
    Create all database tables on application startup.
    This uses SQLAlchemy to generate tables from your model definitions.
    Works for both Docker and Railway databases.

    Note: Docker Compose's depends_on: service_healthy ensures the database
    is ready before this code runs.
    """
    async with engine.begin() as conn:
        # Use run_sync to run the synchronous create_all method
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created successfully")


# Step 8: Add CORS middleware to allow frontend requests
# CORS (Cross-Origin Resource Sharing) is needed because your React app
# runs on a different port (5173) than your API (8000)
# Without this, browsers would block requests from your frontend
# Note: In production with combined deployment, CORS may not be needed
# but we keep it for development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (in production, specify exact URLs)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Step 9: Create our API endpoints
# These are the URLs that clients can visit to interact with todos
# IMPORTANT: API routes must be defined BEFORE the SPA catch-all route


# READ: Get all todos
@app.get("/todos", response_model=List[TodoResponse])
async def get_all_todos(db: AsyncSession = Depends(get_db)):
    """
    Get all todos from the database.

    Returns: A list of all todos in the database
    """
    result = await db.execute(select(Todo))
    todos = result.scalars().all()
    return todos


# READ: Get a single todo by ID
@app.get("/todos/{todo_id}", response_model=TodoResponse)
async def get_todo(todo_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a single todo by its ID.

    Returns: The todo if found, or a 404 error if not
    """
    result = await db.execute(select(Todo).where(Todo.id == todo_id))
    todo = result.scalar_one_or_none()

    if todo is None:
        raise HTTPException(status_code=404, detail=f"Todo with ID {todo_id} not found")

    return todo


# Step 10:
# CREATE: Create a new todo
@app.post("/todos", response_model=TodoResponse, status_code=201)
async def create_todo(todo: TodoCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new todo item.

    Returns: The created todo
    """
    # Create a new Todo object from the request data
    db_todo = Todo(
        title=todo.title,
        description=todo.description,
        completed=todo.completed,
    )

    # Add it to the database session
    db.add(db_todo)
    # Commit the transaction to save it
    await db.commit()
    # Refresh to get the updated data (like the generated ID)
    await db.refresh(db_todo)

    return db_todo


# Step 11:
# UPDATE: Update an existing todo (PATCH - partial update)
@app.patch("/todos/{todo_id}", response_model=TodoResponse)
async def patch_todo(
    todo_id: int, todo_update: TodoUpdate, db: AsyncSession = Depends(get_db)
):
    """
    Partially update an existing todo item (PATCH).
    Only the fields provided in the request will be updated.
    Returns: The updated todo, or a 404 error if not found
    """
    # Get the existing todo
    result = await db.execute(select(Todo).where(Todo.id == todo_id))
    db_todo = result.scalar_one_or_none()

    if db_todo is None:
        raise HTTPException(status_code=404, detail=f"Todo with ID {todo_id} not found")

    # Update only the fields that were provided
    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    # Update the updated_at timestamp
    db_todo.updated_at = datetime.utcnow()

    # Commit the changes
    await db.commit()
    await db.refresh(db_todo)

    return db_todo


# DELETE: Delete a todo
@app.delete("/todos/{todo_id}", status_code=204)
async def delete_todo(todo_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a todo item.

    Returns: 204 No Content if successful, or a 404 error if not found
    """
    # Get the existing todo
    result = await db.execute(select(Todo).where(Todo.id == todo_id))
    db_todo = result.scalar_one_or_none()

    if db_todo is None:
        raise HTTPException(status_code=404, detail=f"Todo with ID {todo_id} not found")

    # Delete it from the database
    await db.delete(db_todo)
    await db.commit()

    return None


# Step 12: Serve static files (frontend) in production
# This must come AFTER all API routes so API routes are matched first
# Check if static directory exists (production build)
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    # Mount static files (CSS, JS, images, etc.)
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(static_dir, "assets")),
        name="assets",
    )

    # Serve index.html for all non-API routes (SPA routing)
    # This catch-all route must be last so API routes take precedence
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """
        Serve the React app for all non-API routes.
        This allows React Router to handle client-side routing.
        """
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        raise HTTPException(status_code=404, detail="Frontend not found")


# Step 13: Run the server
# This code only runs if you execute the file directly (not if imported)
if __name__ == "__main__":
    import uvicorn

    # uvicorn is the web server that runs FastAPI
    # --reload means it will restart when you change the code
    uvicorn.run(app, host="0.0.0.0", port=8000)


# Note: The server will be run in Docker (see Docker Configuration section)
# If you have Poetry installed locally, you can also run:
# poetry run uvicorn server:app --reload
