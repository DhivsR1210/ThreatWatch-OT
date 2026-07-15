# ThreatWatch OT

ThreatWatch OT is a forthcoming cybersecurity platform for operational-technology environments. This first phase establishes a maintainable React and Flask foundation without implementing authentication, models, dashboards, threat feeds, or other business logic.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, and Axios
- Backend: Python 3.12+, Flask, SQLAlchemy, Flask-CORS, Flask-JWT-Extended, and APScheduler
- Development database: SQLite, with PostgreSQL-ready configuration through `DATABASE_URL`

## Project structure

```text
ThreatWatch-OT/
├── backend/
│   ├── app/
│   │   ├── api/          # Route blueprints
│   │   ├── core/         # Configuration and extensions
│   │   ├── models/       # Future database models
│   │   ├── services/     # Future domain services
│   │   ├── scheduler/    # Future scheduled jobs
│   │   └── utils/        # Shared helpers
│   ├── app.py            # Flask entry point
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── layouts/      # Application layouts
│       ├── pages/        # Route pages
│       ├── services/     # API clients
│       ├── hooks/        # Custom React hooks
│       └── utils/        # Frontend utilities
├── docs/
├── docker/
├── .gitignore
└── README.md
```

## Local setup

### Backend

Requires Python 3.12 or later.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

The API starts at `http://localhost:5001`. Confirm it is running with:

```bash
curl http://localhost:5001/api/health
```

### Frontend

Requires a current Node.js LTS release.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite development server is available at `http://localhost:5173`. Axios uses `VITE_API_BASE_URL`, defaulting to `http://localhost:5001/api`.

## Routes

- `/login`
- `/register`
- `/dashboard`
- `/assets`
- `/analytics`
- `/settings`

## Future roadmap

1. Authentication, authorization, and user management
2. Asset inventory and OT network modelling
3. Threat intelligence ingestion and alert correlation
4. Dashboard, analytics, and reporting workflows
5. PostgreSQL deployment, containers, tests, observability, and CI/CD
