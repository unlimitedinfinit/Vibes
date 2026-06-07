# .vibe Quick-Start Prompt

> Copy-paste this to any AI coding agent to create a `.vibe/` semantic layer for a project.
> Replace `[PROJECT_ROOT]` with the actual path.

---

## The Prompt

```
I want you to create a `.vibe/` semantic repository layer for this project.

Read the full guide at: [PASTE PATH TO VIBE_GUIDE.md OR PASTE ITS CONTENTS]

The project is located at: [PROJECT_ROOT]

Follow these steps IN ORDER:

1. DISCOVERY PHASE (do not write any files yet):
   - Scan the entire repository structure (directories, config files, entry points)
   - Read README.md, CONTRIBUTING.md, CHANGELOG.md, and any existing docs
   - Identify the language, framework, database, and deployment stack
   - Read the main entry points (app.tsx, main.py, main.go, etc.)
   - Read the database schema or type definitions to identify entities

2. ASK ME QUESTIONS:
   After your research, ask me anything you couldn't determine from the code:
   - What problem does this solve, in one sentence?
   - Who uses this?
   - What does it deliberately NOT do?
   - Were there major decisions where you debated between alternatives?
   - What's currently broken or known to be problematic?
   - Are there hard constraints I should know about?
   (Skip questions you already answered from the code)

3. CREATE THE FILES:
   After I answer, create all 6 files in [PROJECT_ROOT]/.vibe/:
   - purpose.md
   - architecture.md
   - flows.md
   - entities.md
   - decisions.md
   - state.json

4. RULES:
   - Describe INTENT, not IMPLEMENTATION
   - No file paths, function names, or class hierarchies in .vibe files
   - Every file must pass the test: "Would this still be true if we rewrote the codebase in a different language?"
   - state.json must have valid JSON with the vibe_updated timestamp set to now
   - decisions.md must include alternatives that were rejected and tradeoffs accepted
   - entities.md must include "What depends on it?" for every entity
   - architecture.md must have a diagram that fits on one screen

Do not skip the discovery phase. Do not skip asking me questions.
```

---

## Usage

1. Open a new conversation with your AI coding agent
2. Make sure the agent has access to the project's filesystem
3. Paste the prompt above (with the path filled in)
4. Answer the agent's clarifying questions
5. Review the generated `.vibe/` files
6. Commit them to version control

**Alternatively**, if you have `vibes` installed:

```bash
cd your-project
npx vibes init
```

This scaffolds the skeleton and includes the full guide at `.vibe/VIBE_GUIDE.md`. Then just tell your agent: *"Read `.vibe/VIBE_GUIDE.md` and fill out the skeletons."*
