# Architecture

<!-- 
  INSTRUCTIONS FOR AI AGENT:
  Read .vibe/VIBE_GUIDE.md for the full specification.
  Describe SYSTEMS, not files. Think: "Frontend", "API", "Database", "Auth" — 
  not "src/utils.ts" or "UserController class".
  The diagram should fit on ONE SCREEN.
  Delete these instruction comments when done.
-->

## Systems

<!-- 
  Draw an ASCII or Mermaid diagram showing all major systems.
  Each box is a system (Frontend, Backend, Database, AI Layer, etc.)
  Each arrow is labeled with the protocol (HTTP, WebSocket, SQL, IPC, etc.)
  
  Example:
  ┌──────────┐     HTTP     ┌──────────┐     SQL      ┌──────────┐
  │ Frontend │ ───────────► │ Backend  │ ───────────► │ Database │
  └──────────┘              └──────────┘              └──────────┘
-->

## How They Connect

<!-- A table showing connections between systems -->

| From | To | Protocol | Purpose |
|---|---|---|---|
| | | | |

## Trust Boundaries

<!-- Optional but valuable. Where does trusted data end and untrusted data begin? -->

<!-- 
  Example:
  UNTRUSTED              GATE                    TRUSTED
  Browser input    →   Validation           →   API handler
  API request      →   JWT verification     →   Database query
-->
