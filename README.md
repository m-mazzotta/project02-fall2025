# Project 2: Full-Stack TODO Application

A full-stack web application built with FastAPI (backend), React (frontend), and PostgreSQL (database).

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** React, Vite
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose

## Project Structure


project02-fall2025/
├── database/     # Database Dockerfile
├── backend/      # FastAPI application
└── ui/           # React application


## Getting Started

### Prerequisites

- Docker Desktop installed and running

### Running the Application

1. Clone this repository
2. Create a `.env` file in the root directory (see project documentation) with your database connection string.
3. Run `docker-compose up -d` to start all services
4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Development

See the project documentation for detailed setup and development instructions.
