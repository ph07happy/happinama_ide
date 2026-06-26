# happinama IDE

A browser-based coding environment supporting C, C++, Java, Python, and SQL.

## Repository Structure

The project is organized into two separate directories:

* **/frontend**: Contains the user interface assets.
  - `index.html`: Main application interface.
  - `editor.js`: Monaco editor configuration and template code mappings.
  - `layout.js`: Resize divider controls and fullscreen event handling.
  - `header_info.js`: Time and local weather widgets.
  - CSS stylesheets (`index.css`, `mobile.css`, `header_info.css`).
  - Graphics logos (`logo_h.png`, `logo_f.png`).

* **/backend**: Contains the FastAPI server code.
  - `main.py`: FastAPI server logic that routes code compilation requests to the Judge0 API via RapidAPI.
  - `requirements.txt`: Python package requirements.
  - `render.yaml`: Configuration for Render deployment.

---

## Local Development

### Running the Frontend
To view the IDE locally, open `frontend/index.html` in any web browser. You can also run a local server (e.g., using VS Code Live Server or python's `http.server` module):
```bash
# From the root directory:
python -m http.server 5500
```
Then visit `http://localhost:5500/frontend/`.

### Running the Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your `RAPIDAPI_KEY` environment variable.
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

---

## Deployment Configuration

- **Frontend**: Standard static hosting (e.g. Vercel). The root `vercel.json` file is configured to rewrite all routes to serve directly from the `frontend/` folder.
- **Backend**: Hosted on Render (using the configured `render.yaml` template).
