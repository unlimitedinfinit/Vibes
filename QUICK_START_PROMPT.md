# .vibe Quick-Start Prompt

> Copy-paste this to any AI coding agent to populate a `.vibe/` semantic layer for a project.
> Works best after running `npx vibe-me all` to scaffold the skeleton files first.

---

## Step 1: Scaffold the project

Open a terminal in your project folder:

```bash
npx vibe-me all
```

Creates `.vibe/` (15 files) + `docs/` (11 files) with skeletons.

## Step 2: Tell your AI agent

```
Read .vibe/VIBE_GUIDE.md, then analyze this codebase and fill out all
the skeleton files in .vibe/ and docs/. For files that aren't relevant
(like business.md for a library), write N/A with a brief explanation.
Ask me any questions you can't answer from the code.
```

## Step 3: Validate

```bash
npx vibe-me check
```

This catches real problems — unfilled templates, missing structure, empty sections.
Everything should pass before you commit.

## Step 4: Export to your hub

```bash
npx vibe-me export
```

Copies `.vibe/` + `docs/` into your central hub (auto-updates `index.md`).
Then commit & push the hub repo to sync across machines.

## Step 5: Get cross-project feedback

```bash
npx vibe-me insights
```

Shows you what the hub knows about **this** project — opportunities from other projects,
universal standards, and anti-patterns. Your best work in one project raises the bar everywhere.

---

## Hub setup (one time per computer)

**First computer:**

```bash
# Create the hub (auto-inits git + creates _insights/)
npx vibe-me hub ~/Documents/VibeHub

# Connect to a private GitHub repo
# (the command prints exact steps, or use GitHub Desktop)
```

**Other computers:**

```bash
# Clone the repo first, then link it
git clone git@github.com:YOUR_USERNAME/VibeHub.git
npx vibe-me hub ~/Documents/VibeHub
```

**After exporting 3+ projects**, tell your AI agent:

> *"Read `_insights/ANALYZE.md` in my Vibes Hub and follow the instructions."*

The AI fills out `patterns.md`, `standards.md`, and `opportunities.md` —
then `vibes insights` in any project shows you what applies.

---

## The Detailed AI Prompt (for more control)

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
   - decisions.md — why things exist, with Depends On / Threatened By
   - state.json — machine-readable project health

   Living context:
   - context.md — current focus, blockers, next up, active experiments

   AI agent guide:
   - ai.md — never touch, safe to refactor, requires human approval

   Product memory:
   - product.md — vision, value prop, what drives retention
   - users.md — personas with emotional reality (fears, frustrations, goals)
   - metrics.md — what numbers matter and why
   - experiments.md — what's being tested, hypotheses, results

   Business memory:
   - business.md — strategy, pricing rationale, revenue model
   - market.md — competitors, positioning, opportunities
   - risks.md — technical, legal, market, operational risks

   Then fill out [PROJECT_ROOT]/docs/:
   - README.md, topology.md, architecture.md, api.md, issues.md,
     resolved.md, roadmap.md, developer_guide.md, troubleshooting.md, glossary.md

4. RULES:
   - For .vibe/ files: describe INTENT, not IMPLEMENTATION
   - No file paths or function names in .vibe/ files
   - Every .vibe/ file must pass: "Would this still be true after a rewrite?"
   - For irrelevant files: write "N/A — [reason]." Do NOT delete the file.
   - decisions.md must include Depends On, Threatened By, Revisit When
   - state.json must have valid JSON with vibe_updated set to now

5. VALIDATE:
   When done, run: npx vibe-me check
   Fix anything that doesn't pass.

Do not skip the discovery phase. Do not skip asking me questions.
```
