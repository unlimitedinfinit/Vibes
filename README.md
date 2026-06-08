<div align="center">

# 🌀 vibes

### Project memory. Cross-project intelligence.<br>One command per project. One hub for all of them.

[![npm version](https://img.shields.io/npm/v/vibe-me?style=flat-square&color=7c3aed&label=npm)](https://www.npmjs.com/package/vibe-me)
[![license](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D16-3b82f6?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![zero deps](https://img.shields.io/badge/dependencies-0-f59e0b?style=flat-square)](package.json)

<br>

**Scaffold. Fill. Validate. Sync. Get feedback.**

`vibes` gives every project a `.vibe/` semantic layer and `docs/` folder —<br>
then connects all your projects through a **Vibes Hub** that finds patterns,<br>
surfaces improvements, and lets your best work raise the bar everywhere.

<br>

```
npx vibe-me all          # scaffold .vibe/ + docs/ in any project
npx vibe-me check        # validate quality (catches unfilled templates)
npx vibe-me export       # sync to your hub
npx vibe-me insights     # get cross-project feedback
```

<br>
</div>

---

## 🌊 We're Building in the AI Age — But Our Projects Are Still Dumb

AI coding agents are everywhere. Cursor, Copilot, Windsurf, Claude Code, Gemini — they can all write code. But every one of them hits the same wall:

**They don't understand your project.**

They can read your files. They can parse your syntax. But they can't answer the questions that actually matter:

- *Why does this exist?*
- *What were the alternatives that were rejected?*
- *What's the user actually trying to do — and how do they feel?*
- *What's broken right now? What's the current focus?*
- *What should I absolutely NOT touch?*
- *Is this a business? What's the pricing rationale? Who are the competitors?*

So what happens? Your AI agent guesses. It writes plausible-looking code that violates assumptions nobody documented. You spend an hour debugging something that should've taken five minutes. Sound familiar?

### The Research Question

> **What is the minimum set of files that lets a human or AI understand an entire project — not just the code, but the product, the business, and the current momentum — without reading the source?**

We tested this across production repositories — web apps, CLI tools, embedded systems, game engines, blockchain protocols — and found the answer:

**15 files for project memory. 11 files for operational docs.**

Not a wiki. Not a Confluence graveyard. Not a 200-page design doc nobody reads. Just well-structured files that capture everything that matters — from repository architecture to business strategy to user psychology.

### Before and After

<table>
<tr>
<td width="50%">

**❌ Without vibes**
- AI agent reads 50 files to guess the architecture
- New developer asks "why is it built this way?" — nobody remembers
- Known bugs live in someone's head, not in a file
- Every AI session starts from scratch
- Nobody knows the pricing rationale or competitive landscape
- User frustrations are invisible — product decisions are guesswork
- Documentation rots because nobody owns it
- Your projects are islands — lessons learned in one are invisible to others

</td>
<td width="50%">

**✅ With vibes**
- AI agent reads `.vibe/` in 3 seconds, understands everything
- Decisions recorded with rejected alternatives and tradeoffs
- Issues tracked, resolved issues archived, context is live
- Every AI session builds on the last one
- Business strategy, pricing, and market position are documented
- User personas include emotional reality — fears, confusion, goals
- Documentation stays fresh because the AI updates it
- **Hub connects all your projects** — patterns, standards, and improvements flow between them

</td>
</tr>
</table>

> **This isn't documentation. It's a digital twin of your entire portfolio.**<br>
> Repository memory. Product memory. Business memory. AI instructions. Living context.<br>
> Each project explains itself — and the hub makes all your projects learn from each other.

---

## ✨ The Solution

`vibes` generates two complementary layers:

<table>
<tr>
<td width="50%" valign="top">

### 🧠 `.vibe/` — Project Memory
*15 files covering 5 layers of understanding*

```
.vibe/
│
│ ── Core (repository memory)
├── purpose.md          What & why
├── architecture.md     Systems & connections
├── flows.md            User journeys
├── entities.md         Important nouns
├── decisions.md        Why, with dependency graph
├── state.json          Machine-readable health
│
│ ── Living Context
├── context.md          What's happening NOW
│
│ ── AI Agent Guide
├── ai.md               Safe zones & rules
│
│ ── Product Memory
├── product.md          Vision & retention
├── users.md            Personas & emotions
├── metrics.md          What numbers matter
├── experiments.md      What we're testing
│
│ ── Business Memory
├── business.md         Strategy & revenue
├── market.md           Competitors & positioning
└── risks.md            Threats & mitigations
```

**Not a business?** The AI writes "N/A" and moves on.<br>
**Not a product?** Same thing. Only relevant files get filled.

</td>
<td width="50%" valign="top">

### 📄 `docs/` — Operational Layer
*11 files for implementation-level documentation*

```
docs/
├── README.md           Executive summary
├── topology.md         File & folder map
├── architecture.md     Component-level details
├── api.md              API endpoints & formats
├── issues.md           Open bugs & blockers
├── resolved.md         Closed issues archive
├── roadmap.md          Milestones & priorities
├── developer_guide.md  Setup, build, test, deploy
├── troubleshooting.md  Common errors & fixes
├── glossary.md         Project-specific terms
└── decisions/          Architecture decision records
```

<br>

**`.vibe/` = intent** (survives a rewrite)<br>
**`docs/` = implementation** (changes with the code)

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Option 1: npx (no install needed)

```bash
# Scaffold everything at once
npx vibe-me all

# Or individually:
npx vibe-me init    # .vibe/ only (15 files)
npx vibe-me docs    # docs/ only (11 files)
```

### Option 2: Global install

```bash
npm install -g vibe-me
vibes all
```

### Option 3: One-click (Windows)

Download [`Vibe.bat`](Vibe.bat), drop it in any project folder, and double-click it.

---

## 🛠️ Commands

| Command | Description |
|:---|:---|
| `vibes init` | Create `.vibe/` with the full suite — 15 files + guide |
| `vibes docs` | Create `docs/` operational documentation — 11 files |
| `vibes all` | Create both `.vibe/` and `docs/` at once |
| `vibes check` | Validate all files — catches unfilled templates, empty sections, missing structure |
| `vibes status` | Quick health dashboard with filled/N-A/empty counts |
| `vibes reset` | Delete and recreate everything |
| | |
| `vibes hub <path>` | Set up a central hub — git inits, creates `_insights/`, saves config |
| `vibes export` | Export `.vibe/` + `docs/` from current project to your hub |
| `vibes insights` | Show hub feedback for this project — opportunities, standards, anti-patterns |
| `vibes help` | Show all commands |

---

## 🤖 The AI Workflow

After scaffolding, point your AI coding agent at the project and say:

> *"Read `.vibe/VIBE_GUIDE.md`, then analyze this codebase and fill out all the skeleton files in `.vibe/` and `docs/`. For files that aren't relevant (like `business.md` for a library), write N/A with a brief explanation. Ask me any questions you can't answer from the code."*

The included `VIBE_GUIDE.md` (33KB) contains everything the agent needs:
- Detailed instructions for each file
- Examples across 6+ project types (web apps, CLI tools, games, embedded firmware, libraries, mobile)
- Anti-patterns and common mistakes
- Quality checklist
- The discovery protocol (what to scan, what to ask the user)

### The Update Protocol

Every time an AI agent touches a repository with `.vibe/`, the workflow becomes:

```
Read .vibe/ to understand the project
         ↓
    Make code changes
         ↓
Update .vibe/ + docs/ to reflect new understanding
         ↓
   Commit everything together
```

> The semantic model is a **first-class citizen** — not an afterthought.

---

## 🎯 The Core Principle

> **Describe intent, not implementation.**

Every line in `.vibe/` should pass this test:

*"Would this still be true if we rewrote the entire codebase in a different language?"*

| | Intent ✅ | Implementation ❌ |
|:---|:---|:---|
| **Architecture** | "Frontend talks to API over HTTP" | "`UserController` calls `db.query()`" |
| **Decisions** | "We chose SQLite because <100 writes/hour" | "The `DatabaseService` class has a `connect()` method" |
| **Flows** | "User uploads document → AI analyzes → results shown" | "`POST /api/docs` calls `processDocument()` in `services/ai.ts`" |
| **Entities** | "Invoice — created by billing system, immutable after send" | "`Invoice` model has fields `id`, `amount`, `created_at`" |

---

## 🔍 Quality Validation

`vibes check` doesn't just count lines — it catches real problems:

```bash
vibes check
```

**On a freshly scaffolded project (before AI fills it out):**
```
  🔍 vibes check

  ── .vibe/ ──

  ✖ purpose.md — still contains template instructions (unfilled)
  ✖ architecture.md — still contains template instructions (unfilled)
  ✖ flows.md — still contains template instructions (unfilled)
  ...

  Result: 24 failed, 1 warnings, 0 passed
```

**After your AI agent fills everything out:**
```
  🔍 vibes check

  ── .vibe/ ──

  ✔ purpose.md — 33 lines
  ✔ architecture.md — 86 lines
  ✔ flows.md — 144 lines
  ✔ entities.md — 135 lines
  ⚠ decisions.md — 91 lines (no dependency graph fields)
  ✔ state.json — 82 lines
  ✔ context.md — 28 lines
  ✔ ai.md — 45 lines
  ✔ product.md — 62 lines
  ✔ users.md — 78 lines
  ✔ metrics.md — 24 lines
  ✔ experiments.md — 19 lines
  ⊘ business.md — N/A (not applicable)
  ⊘ market.md — N/A (not applicable)
  ✔ risks.md — 34 lines

  Result: 2 N/A, 1 warnings, 22 passed
```

What it catches:
- **Unfilled templates** — files that still have `INSTRUCTIONS FOR AI AGENT` (hard fail)
- **Missing structure** — `purpose.md` without a "NOT do" section, `decisions.md` without dependency graph
- **Empty bullets/tables** — placeholder content that wasn't filled in
- **Stale data** — `state.json` not updated in 30+ days
- **Missing emotional reality** — `users.md` without frustrations, fears, or goals
- **N/A files** — recognized and not penalized

---

## 🗂️ Vibes Hub — Your Projects Talking to Each Other

The hub is where the magic happens. Every project you work on — across any number of computers — exports its `.vibe/` and `docs/` into one central repo. An AI analyzes them all and finds patterns, anti-patterns, and improvements that flow **back** into each project.

```
┌─────────────┐     vibes export     ┌──────────────┐     vibes insights     ┌─────────────┐
│  Project A   │ ──────────────────→  │   Vibes Hub  │  ←────────────────────  │  Project B  │
│  .vibe/      │                      │  _insights/  │                         │  .vibe/     │
│  docs/       │                      │  patterns    │   "You should adopt     │  docs/      │
└─────────────┘                       │  standards   │    Project A's auth"    └─────────────┘
                                      │  opportunities│
                                      └──────────────┘
```

### Step 1: Set up the hub (one time)

```bash
vibes hub ~/Documents/VibeHub
```

Creates a folder with git, a README, and an `_insights/` intelligence layer. Connect it to a private GitHub repo so it syncs across machines.

### Step 2: Export from each project

```bash
cd your-project
vibes export
```

Copies `.vibe/` and `docs/` into your hub, organized by project name. Auto-generates an `index.md` dashboard.

### Step 3: AI analysis (after 3+ projects)

Tell your AI agent:

> *"Read `_insights/ANALYZE.md` in my Vibes Hub and follow the instructions."*

The AI reads every project's `.vibe/` files and fills out:

| File | What it finds |
|:---|:---|
| `_insights/patterns.md` | Architecture, security, and tech stack patterns across all projects |
| `_insights/standards.md` | Universal rules that should apply everywhere (file size limits, schema validation, etc.) |
| `_insights/opportunities.md` | Specific transfers — "Project A does X well → Project B should adopt it because Y" |

### Step 4: Pull feedback into any project

```bash
cd your-project
vibes insights
```

This reads the hub's `_insights/` and shows you **what applies to the project you're standing in**:

```
  💡 vibes insights — JustLegal

  ── Opportunities ──

  ⚡ open-season → JustLegal
     Adopt EXIF metadata scrubbing for user-uploaded files.
  ⚡ JustPolitics → JustLegal / Spark
     Mobile-responsive WebKit GPU blur optimizations.

  ── Universal Standards ──

  ◆ Strict File Size Limits
  ◆ Structured Schema Validation
  ◆ Local API Access Authentication

  ── Anti-Patterns ──

  ⚠ Unsecured Localhost APIs

  16 insights found. Review _insights/ in your hub for full details.
```

One project's best practice becomes every project's standard. **Your portfolio gets smarter every time you export.**

### Multi-machine sync

The hub is a standard Git repo. Push from one machine, pull on another:

1. **First machine:** `vibes hub ~/Documents/VibeHub` → push to private GitHub repo
2. **Other machines:** Clone the repo → `vibes hub ~/path/to/cloned/VibeHub`
3. Export projects on any machine → commit & push → pull on the other → `vibes insights`

```
VibeHub/
├── index.md                Auto-generated dashboard
├── _insights/
│   ├── ANALYZE.md          Prompt for AI analysis
│   ├── patterns.md         Cross-project patterns
│   ├── standards.md        Universal standards
│   └── opportunities.md    Transferable improvements
├── ProjectA/
│   ├── .vibe/
│   └── docs/
├── ProjectB/
│   ├── .vibe/
│   └── docs/
└── ...
```

---

## 🌍 Works With Everything

`.vibe/` is language-agnostic. It works for:

<table>
<tr>
<td>

**Languages**
- Python
- TypeScript / JavaScript
- Go
- Rust
- C# / .NET
- Java
- C / C++
- Swift

</td>
<td>

**Frameworks**
- React / Next.js / Vue
- Django / FastAPI / Flask
- Spring / Rails
- Unity / Unreal / Godot
- React Native / Flutter
- Express / NestJS
- Tauri / Electron

</td>
<td>

**Project Types**
- Web applications
- CLI tools
- Mobile apps
- Libraries & packages
- Microservices
- Embedded firmware
- Game engines
- Monorepos

</td>
</tr>
</table>

Because it describes **what** and **why**, not **how**.

---

## 📁 Repository Structure

```
Vibes/
├── bin/
│   └── vibes.js                    CLI (zero dependencies)
├── templates/
│   ├── purpose.md                  ── Core
│   ├── architecture.md
│   ├── flows.md
│   ├── entities.md
│   ├── decisions.md                   (with dependency graph)
│   ├── state.json
│   ├── context.md                  ── Living Context
│   ├── ai.md                       ── AI Agent Guide
│   ├── product.md                  ── Product Memory
│   ├── users.md
│   ├── metrics.md
│   ├── experiments.md
│   ├── business.md                 ── Business Memory
│   ├── market.md
│   ├── risks.md
│   └── docs/                       ── Operational Docs
│       ├── README.md
│       ├── topology.md
│       ├── architecture.md
│       ├── api.md
│       ├── issues.md
│       ├── resolved.md
│       ├── roadmap.md
│       ├── developer_guide.md
│       ├── troubleshooting.md
│       ├── glossary.md
│       └── decisions/
│           └── 0001-template.md
├── spec/
│   └── VIBE_GUIDE.md               Full spec (bundled on init)
├── Vibe.bat                         One-click Windows installer
├── QUICK_START_PROMPT.md            Copy-paste prompt for AI agents
├── VIBE_GUIDE.md                    Full spec (readable at root)
├── package.json
├── LICENSE
└── README.md
```

---

## 📜 License

MIT — use it, fork it, build on it.

---

<div align="center">

## 💡 The Paradigm Shift

<br>

Most AI coding tools today operate in a simple loop:

**Read Code → Write Code → Hope It Works**

The AI has no memory. No context. No understanding of *why* things are the way they are.<br>
Every session starts from zero. Every agent makes the same mistakes.

With vibes, the loop transforms:

```
     ┌─────────────────────────────────────┐
     │                                     │
     ▼                                     │
Read .vibe/ → Understand Intent            │
     │                                     │
     ▼                                     │
  Read Code → Make Changes                 │
     │                                     │
     ▼                                     │
Update .vibe/ + docs/ ─────────────────────┘
```

**The semantic model becomes a first-class citizen.**

It's not generated once and forgotten. It's not a README that rots.<br>
It's a living, continuously-maintained digital twin that gets smarter every time anyone — human or AI — touches the project.

<br>

---

### 🔮 The Vision

Imagine a world where:

- You open **any** repository and instantly understand what it does, why it exists, and what's broken — before reading a single line of code
- Your AI agent picks up **exactly** where the last one left off — with full context of every decision, every experiment, every user frustration
- New team members are productive in **hours**, not weeks
- Product decisions are grounded in documented user reality, not guesswork
- Business strategy, pricing rationale, and competitive positioning live next to the code — not in a forgotten Google Doc
- Documentation **never** goes stale because the AI updates it as part of its normal workflow

That world starts with one command.

<br>

```bash
npx vibe-me all
```

<br>

---

*Created by [Joshua M. Abrams](https://github.com/unlimitedinfinit)*

*The `.vibe` spec is version 1.0 — tested across production repositories spanning Go, Rust, TypeScript, Python, and Solidity.*<br>
*If you create `.vibe/` for your project, [open an issue](https://github.com/unlimitedinfinit/Vibes/issues) and share what you learned.*

<br>

**Stop giving your AI agents amnesia. Give them vibes.**

</div>
