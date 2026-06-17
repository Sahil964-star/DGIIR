import os

base_dir = "DGIIR"

directories = [
    "frontend/src/pages",
    "frontend/src/components",
    "frontend/src/layouts",
    "frontend/src/services",
    "frontend/src/hooks",
    "frontend/src/routes",
    "frontend/src/context",
    "backend/src/routes",
    "backend/src/controllers",
    "backend/src/services",
    "backend/src/models",
    "backend/src/middlewares",
    "backend/src/utils",
    "backend/src/config",
    "ai/classifiers",
    "ai/llm",
    "ai/prompts",
    "ai/geospatial",
    "ai/clustering",
    "ai/notebooks",
    "dashboard/cm_dashboard",
    "dashboard/operations_dashboard",
    "dashboard/analytics",
    "shared",
    "docs",
    "infrastructure",
    "uploads",
    "scripts",
    "tests"
]

files = {
    "frontend/src/App.jsx": "// TODO: Placeholder for React App component\n",
    "backend/src/index.js": "// TODO: Placeholder for Express server entry point\n",
    "ai/README.md": "# AI Modules\n\n// TODO: Placeholder for AI documentation\n",
    "dashboard/README.md": "# Dashboards\n\n// TODO: Placeholder for Dashboards\n",
    "scripts/list_operations.py": "def perform_list_operations():\n    # TODO: Placeholder for list operations\n    pass\n",
    "docs/architecture.md": "# DGIIR Architecture\n\n## High-Level Architecture\n\n- Frontend: React, Vite, Tailwind\n- Backend: Node.js, Express, MongoDB\n- AI: Python-based classifiers and LLM integration\n- Infra: Docker Compose, Redis, MinIO\n\n// TODO: Add detailed architecture diagram and descriptions\n",
    "docs/roadmap.md": "# DGIIR Roadmap\n\n// TODO: Define MVP roadmap\n",
    "docs/api_contracts.md": "# API Contracts\n\n// TODO: Define REST/GraphQL API contracts\n",
    "README.md": "# DGIIR (Digital Grievance Intelligence & Incident Resolution)\n\n## Git Workflow\n\nBranch recommendations for the team of 4 developers:\n- `main`: Production-ready code\n- `frontend`: Frontend MVP development\n- `backend`: Backend API development\n- `ai`: AI classification and clustering modules\n- `dashboard`: CM and Operations Dashboard development\n\n// TODO: Add setup instructions\n",
    "docker-compose.yml": "version: '3.8'\n\nservices:\n  # TODO: Placeholder for MongoDB, Redis, MinIO, Backend, Frontend\n",
    ".env.example": "# TODO: Placeholder for environment variables\nPORT=3000\nMONGO_URI=mongodb://localhost:27017/dgiir\n",
    ".gitignore": "node_modules/\n.env\n__pycache__/\n*.log\nuploads/\n",
    "CONTRIBUTING.md": "# Contributing to DGIIR\n\n// TODO: Add contribution guidelines\n"
}

os.makedirs(base_dir, exist_ok=True)

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

for f, content in files.items():
    filepath = os.path.join(base_dir, f)
    with open(filepath, "w", encoding="utf-8") as file:
        file.write(content)

print("Scaffolding complete.")
