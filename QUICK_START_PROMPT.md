# .vibe Quick-Start Prompt

> Copy-paste this to any AI coding agent to populate a `.vibe/` semantic layer for a project.
> Works best after running `npx vibe-me all` to scaffold the skeleton files first.

---

## The Prompt

```
I want you to populate the .vibe/ semantic layer and docs/ for this project.

Read the full guide at: .vibe/VIBE_GUIDE.md
(If that file doesn't exist, run: npx vibe-me all)

The project is located at: [PROJECT_ROOT]

Follow these steps IN ORDER:

1. DISCOVERY PHASE (do not write any files yet):
   - Scan the entire repository structure (directories, config files, entry points)
   - Read README.md, CONTRIBUTING.md, CHANGELOG.md, and any existing docs
   - Identify the language, framework, database, and deployment stack
   - Read the main entry points (app.tsx, main.py, main.go, etc.)
   - Read the database schema or type definitions to identify entities
   - Check for pricing pages, user analytics, or business-related configs

2. ASK ME QUESTIONS:
   After your research, ask me anything you couldn't determine from the code:
   - What problem does this solve, in one sentence?
   - Who uses this? How do they feel when they use it?
   - What does it deliberately NOT do?
   - Were there major decisions where you debated between alternatives?
   - What's currently broken or known to be problematic?
   - Are there hard constraints I should know about?
   - Is this a product with users? A business with revenue?
   - What are you actively working on RIGHT NOW?
   - What's stuck or blocked?
   - What should an AI agent never touch in this codebase?
   (Skip questions you already answered from the code)

3. CREATE/UPDATE ALL FILES:
   After I answer, fill out every file in [PROJECT_ROOT]/.vibe/:

   Core (repository memory):
   - purpose.md — what is this, who is it for, what it does NOT do
   - architecture.md — systems and how they connect (not files — systems)
   - flows.md — user journeys, step by step
   - entities.md — important nouns with "What depends on it?" for each
   - decisions.md — why things exist, with Depends On / Threatened By / Related fields
   - state.json — machine-readable project health

   Living context:
   - context.md — current focus, blockers, next up, active experiments

   AI agent guide:
   - ai.md — never touch, safe to refactor, requires human approval, project rules

   Product memory:
   - product.md — vision, value prop, what drives retention, where users get confused
   - users.md — personas with emotional reality (fears, frustrations, goals)
   - metrics.md — what numbers matter and why
   - experiments.md — what's being tested, hypotheses, results

   Business memory:
   - business.md — strategy, pricing rationale, revenue model, goals
   - market.md — competitors, positioning, opportunities, threats
   - risks.md — technical, legal, market, operational risks

   Then fill out [PROJECT_ROOT]/docs/:
   - README.md, topology.md, architecture.md, api.md, issues.md,
     resolved.md, roadmap.md, developer_guide.md, troubleshooting.md, glossary.md

4. RULES:
   - For .vibe/ files: describe INTENT, not IMPLEMENTATION
   - No file paths, function names, or class hierarchies in .vibe/ files
   - Every .vibe/ file must pass: "Would this still be true after a complete rewrite?"
   - For files that aren't relevant (e.g., business.md for a library):
     Write "N/A — This is a [type], not a [business/product]." Do NOT delete the file.
   - decisions.md must include Depends On, Threatened By, Related, Revisit When
   - entities.md must include "What depends on it?" for every entity
   - state.json must have valid JSON with vibe_updated set to now
   - context.md should reflect what's happening THIS WEEK

Do not skip the discovery phase. Do not skip asking me questions.
```

---

## Usage

1. Open a new conversation with your AI coding agent
2. Make sure the agent has access to the project's filesystem
3. Run `npx vibe-me all` in the project root to scaffold the skeletons
4. Paste the prompt above (with the path filled in)
5. Answer the agent's clarifying questions
6. Review the generated files
7. Commit everything to version control

**Even simpler** — after scaffolding, just tell your agent:

> *"Read `.vibe/VIBE_GUIDE.md` and fill out all the skeletons in `.vibe/` and `docs/`. Ask me anything you can't determine from the code."*
