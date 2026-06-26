# happinama IDE — Local Setup & Development Guide

happinama IDE is a browser-based, lightweight coding environment supporting execution for **C, C++, Java, Python, and SQL**. 

This repository is organized as a decoupled, full-stack application consisting of a static HTML/JS/CSS frontend, a FastAPI gateway backend, and a local sandboxed Judge0 compilation service running via Docker.

---

## Architecture Diagram

```
[ Frontend (HTML/JS/Monaco) ]
            │
            ▼ (HTTP /execute request to http://localhost:8000)
[ Backend (FastAPI Gateway) ]
            │
            ▼ (HTTP request to local Judge0 API on port 2358)
┌─────────────────── Docker Sandbox (backend/judge0) ───────────────────┐
│                                                                       │
│  [ Judge0 Server ] ────► Pushes Tasks ────► [ Redis Queue ]           │
│         ▲                                          │                  │
│         │                                          ▼                  │
│   Reads Results                                Reads Tasks            │
│         │                                          │                  │
│         └─────────────── [ Postgres DB ] ◄───► [ Judge0 Worker ]      │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:
* **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/) (ensure the Docker daemon is running).
* **Python 3.8+**: [Download here](https://www.python.org/downloads/) (ensure Python is added to your system `PATH`).
* **Node.js** (Optional, only needed if you want to run static linting checks on the JS files).

---

## Directory Structure

```
happinama_ide/
├── frontend/                 # Static frontend code
│   ├── index.html            # Main HTML application layout
│   ├── editor.js             # Monaco editor configs & template mappings
│   ├── layout.js             # Resizing handlers & screen settings
│   ├── header_info.js        # Time & weather widgets
│   ├── index.css             # Main stylesheet (themes & layout)
│   ├── mobile.css            # Responsive layout adjustments
│   ├── header_info.css       # Weather widget styles
│   ├── logo_h.png            # Header logo
│   └── logo_f.png            # Footer logo
├── backend/                  # FastAPI server & Docker configs
│   ├── main.py               # Main FastAPI server entry point
│   ├── requirements.txt      # Python dependencies
│   ├── render.yaml           # Deployment config template
│   └── judge0/               # Local Judge0 Docker Compose folder
│       ├── docker-compose.yml# Container orchestration services
│       └── judge0.conf       # Local database & cache settings
├── vercel.json               # Vercel deployment routing configurations
└── README.md                 # Project documentation
```

---

## Step-by-Step Local Startup Guide

Follow these three steps to spin up the local environment:

### Step 1: Start Judge0 via Docker Compose

1. Open your terminal/command prompt and navigate to the `backend/judge0/` directory:
   ```bash
   cd backend/judge0
   ```
2. Start the local Judge0 service containers in detached mode:
   ```bash
   docker compose up -d
   ```
3. Verify that all 4 containers (`judge0-server`, `judge0-worker`, `judge0-db`, and `judge0-redis`) are running:
   ```bash
   docker ps
   ```
   *Note: Port `2358` will be opened on your local machine for backend communication.*

---

### Step 2: Start the FastAPI Gateway Backend

The FastAPI backend handles language mapping, manages requests, and acts as the secure gateway to the local Judge0 sandbox.

1. Open a new terminal window and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. **Create and Activate a Virtual Environment (Recommended):**
   * **Windows (Command Prompt / PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI gateway server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will boot up locally at `http://localhost:8000`. It is pre-configured to automatically connect to your local Judge0 instance at port `2358`.*

---

### Step 3: Run the Frontend

1. Open a third terminal window and start a simple local server in the repository root:
   ```bash
   # From root folder:
   python -m http.server 5500
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:5500/frontend/
   ```

*Note: The frontend code (`frontend/editor.js`) automatically detects if you are running it on `localhost` or `127.0.0.1` and will connect to your local backend (`http://localhost:8000`). If accessed from a remote domain, it falls back to the hosted production API.*

---

## Shutting Down Local Services

To clean up and shut down the Docker services when you are finished developing:

1. Open your terminal in the `backend/judge0/` directory.
2. Stop and remove the containers:
   ```bash
   docker compose down
   ```
   *This stops the Postgres and Redis database instances and clears the active virtual network.*

---

## Troubleshooting Guide

### 1. Docker Daemon Connection Errors
If you see the error `failed to connect to the docker API... check if the daemon is running`:
* **Fix**: Open Docker Desktop on your machine and wait for the status indicator in the bottom-left corner to turn green. Then, rerun `docker compose up -d`.

### 2. Port Conflict Errors (FastAPI or Judge0)
If starting uvicorn gives an `address already in use` error:
* **Fix**: A process is already running on port `8000`. You can change the port for the backend by running:
  ```bash
  uvicorn main:app --reload --port 8001
  ```
  *(If you do this, make sure to update the local port in `frontend/editor.js` to match `8001`)*

### 3. Execution Returns "could not reach backend" in IDE Output
* **Fix**: Ensure that the FastAPI server is running at `http://localhost:8000` (you can check this by visiting `http://localhost:8000/` in your browser. It should show a JSON response saying `{"status":"happinama backend running"}`).
