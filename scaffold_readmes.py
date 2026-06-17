import os

base_dir = "DGIIR"

dirs = [
    "backend/src/routes",
    "backend/src/controllers",
    "backend/src/services",
    "backend/src/models",
    "backend/src/middlewares",
    "backend/src/config",
    "backend/src/utils",
    "ai/classifiers",
    "ai/llm",
    "ai/prompts",
    "ai/geospatial",
    "ai/clustering",
    "ai/notebooks"
]

for d in dirs:
    path = os.path.join(base_dir, d)
    os.makedirs(path, exist_ok=True)
    
    readme_path = os.path.join(path, "README.md")
    # Only create if it doesn't exist, to not modify existing files (though they are new anyway)
    if not os.path.exists(readme_path):
        folder_name = os.path.basename(path)
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(f"# {folder_name.capitalize()}\n\n// TODO: Placeholder README for {folder_name} module.\n")

print("Added placeholder README files.")
