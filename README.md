# vibes

**Every repository should contain a continuously maintained, AI-readable and human-readable model of itself.**

`vibes` creates a `.vibe/` folder in your project — 6 files that let any human or AI understand your codebase without reading the source code.

```
.vibe/
├── purpose.md       — What is this? Who is it for? What does it NOT do?
├── architecture.md  — Systems and how they connect (not files — systems)
├── flows.md         — User journeys, step by step
├── entities.md      — Important nouns and their relationships
├── decisions.md     — Why things exist the way they do
└── state.json       — Machine-readable project health snapshot
```

## Why?

Most repositories are impossible to understand without reading the source code. Documentation describes *how* things work but never captures:

- **Why** things exist (what alternatives were rejected?)
- **What** users actually do (step-by-step journeys, not component descriptions)
- **What** the important nouns are (domain entities, not class hierarchies)
- **What** the system *is* (intent, not implementation)

The `.vibe/` folder answers these questions. It describes **intent rather than implementation** — which means it's language-agnostic, framework-agnostic, and survives complete rewrites.

## Quick Start

### Option 1: npx (no install)

```bash
npx vibes init
```

### Option 2: Global install

```bash
npm install -g vibes
vibes init
```

### Option 3: Clone and run

```bash
git clone https://github.com/unlimitedinfinit/Vibes.git
cd your-project
node /path/to/Vibes/bin/vibes.js init
```

This creates a `.vibe/` folder with skeleton templates and a `VIBE_GUIDE.md` instruction file.

## Usage

### Initialize

```bash
cd your-project
vibes init
```

Creates `.vibe/` with 6 skeleton files + the full guide. Auto-detects your project name from `package.json`, `Cargo.toml`, `go.mod`, or `pyproject.toml`.

### Fill it out (with your AI agent)

Point your AI coding agent at the project and tell it:

> "Read `.vibe/VIBE_GUIDE.md`, then analyze this codebase and fill out all the skeleton files in `.vibe/`. Ask me any questions you can't answer from the code."

The guide contains detailed instructions, examples across 6+ project types, anti-patterns, and a quality checklist.

### Validate

```bash
vibes check
```

Checks that all 6 files exist, are non-empty, and pass quality heuristics:
- `purpose.md` has a "NOT do" section
- `decisions.md` has 2+ decisions
- `entities.md` has "What depends on it?" fields
- `flows.md` has 2+ user flows
- `state.json` is valid JSON and not stale (>30 days)

### Reset

```bash
vibes reset
```

Deletes and recreates `.vibe/` with fresh skeletons.

## The Core Principle

> **Describe intent, not implementation.**

Every line in `.vibe/` should pass this test: *"Would this still be true if we rewrote the entire codebase in a different language?"*

- ✅ "We chose SQLite because the access pattern is <100 writes/hour"
- ❌ "The `DatabaseService` class has a `connect()` method"
- ✅ "User uploads document → AI analyzes → results displayed"
- ❌ "POST /api/documents calls `processDocument()` in `services/ai.ts`"

## The AI Update Protocol

Every time an AI agent touches a repository with `.vibe/`, the workflow is:

```
Read .vibe/ to understand the project
  ↓
Make code changes
  ↓
Update relevant .vibe/ files to reflect new understanding
  ↓
Commit code + .vibe changes together
```

The semantic model is a first-class citizen — not an afterthought.

## Works With

`.vibe/` is language-agnostic. It works for:

- Python, TypeScript, Go, Rust, C#, Java, C++, Swift
- React, Next.js, Django, FastAPI, Spring, Rails
- Unity, Unreal, Godot
- Embedded firmware, CLI tools, mobile apps, libraries
- Monorepos, microservices, serverless

Because it describes **what** and **why**, not **how**.

## Repository Structure

```
Vibes/
├── bin/vibes.js            — CLI entry point (zero dependencies)
├── templates/              — Skeleton files copied into .vibe/
│   ├── purpose.md
│   ├── architecture.md
│   ├── flows.md
│   ├── entities.md
│   ├── decisions.md
│   └── state.json
├── spec/
│   └── VIBE_GUIDE.md       — Full spec with examples and instructions
├── QUICK_START_PROMPT.md    — Copy-paste prompt for AI agents
├── VIBE_GUIDE.md            — Full spec (also at root for easy reading)
├── package.json
├── LICENSE                  — MIT
└── README.md                — This file
```

## License

MIT — use it, fork it, build on it.

## Contributing

The `.vibe` spec is version 1.0. After testing across 20+ repositories, we'll refine which information is always useful, which is noise, what AI can extract automatically, and what humans must provide.

If you create `.vibe/` for your project, open an issue and share what you learned.
