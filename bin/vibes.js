#!/usr/bin/env node

// vibes — Semantic repository layers + standardized docs for humans and AI
// Zero dependencies. Single file. Works with npx.

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const VIBE_DIR = '.vibe';
const DOCS_DIR = 'docs';
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const SPEC_DIR = path.join(__dirname, '..', 'spec');

const VIBE_FILES = [
  'purpose.md', 'architecture.md', 'flows.md',
  'entities.md', 'decisions.md', 'state.json'
];

const DOCS_FILES = [
  'README.md', 'topology.md', 'architecture.md', 'api.md',
  'issues.md', 'resolved.md', 'roadmap.md', 'developer_guide.md',
  'troubleshooting.md', 'glossary.md'
];

const DOCS_DIRS = ['decisions'];
const DOCS_EXTRA = ['decisions/0001-template.md'];
const SPEC_FILE = 'VIBE_GUIDE.md';

// ─────────────────────────────────────────────
// Colors (no dependencies — raw ANSI)
// ─────────────────────────────────────────────

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const magenta = (s) => `\x1b[35m${s}\x1b[0m`;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function copy(src, dest) {
  fs.writeFileSync(dest, fs.readFileSync(src, 'utf-8'), 'utf-8');
}

function getProjectName(dir) {
  for (const [file, regex] of [
    ['package.json', null],
    ['Cargo.toml', /^name\s*=\s*"(.+)"/m],
    ['go.mod', /^module\s+(.+)/m],
    ['pyproject.toml', /^name\s*=\s*"(.+)"/m],
  ]) {
    const p = path.join(dir, file);
    if (!exists(p)) continue;
    try {
      const content = fs.readFileSync(p, 'utf-8');
      if (file === 'package.json') {
        const pkg = JSON.parse(content);
        if (pkg.name) return pkg.name;
      } else {
        const m = content.match(regex);
        if (m) return file === 'go.mod' ? m[1].split('/').pop() : m[1];
      }
    } catch {}
  }
  return path.basename(dir);
}

function now() { return new Date().toISOString(); }

// ─────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────

function cmdInit(targetDir) {
  const vibeDir = path.join(targetDir, VIBE_DIR);
  const name = getProjectName(targetDir);

  if (exists(vibeDir)) {
    console.log(red('\n  ✖ .vibe/ already exists.'));
    console.log(dim('    Use "vibes reset" to overwrite.\n'));
    process.exit(1);
  }

  console.log('');
  console.log(bold('  ⚡ vibes init'));
  console.log(dim(`  Creating .vibe/ semantic layer for ${cyan(name)}`));
  console.log('');

  fs.mkdirSync(vibeDir, { recursive: true });

  let count = 0;
  for (const file of VIBE_FILES) {
    const src = path.join(TEMPLATES_DIR, file);
    const dest = path.join(vibeDir, file);
    if (file === 'state.json') {
      let c = fs.readFileSync(src, 'utf-8');
      c = c.replace('PROJECT_NAME', name).replace(/TIMESTAMP/g, now());
      fs.writeFileSync(dest, c, 'utf-8');
    } else {
      copy(src, dest);
    }
    console.log(green('  ✔ ') + dim('.vibe/') + file);
    count++;
  }

  // Copy guide
  copy(path.join(SPEC_DIR, SPEC_FILE), path.join(vibeDir, SPEC_FILE));
  console.log(green('  ✔ ') + dim('.vibe/') + SPEC_FILE + dim(' (agent instructions)'));
  count++;

  console.log('');
  console.log(green(`  ✔ Created ${count} files in .vibe/`));
  printNextSteps();
}

function cmdDocs(targetDir) {
  const docsDir = path.join(targetDir, DOCS_DIR);
  const name = getProjectName(targetDir);

  if (exists(docsDir)) {
    // Check if it has content already
    const contents = fs.readdirSync(docsDir);
    if (contents.length > 0) {
      console.log(yellow('\n  ⚠ docs/ already exists with ' + contents.length + ' items.'));
      console.log(dim('    Skipping files that already exist. Adding missing ones only.\n'));
    }
  }

  console.log('');
  console.log(bold('  📄 vibes docs'));
  console.log(dim(`  Creating docs/ structure for ${cyan(name)}`));
  console.log('');

  // Create docs dir and subdirs
  fs.mkdirSync(docsDir, { recursive: true });
  for (const sub of DOCS_DIRS) {
    fs.mkdirSync(path.join(docsDir, sub), { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  // Copy doc files (skip if they already exist)
  for (const file of [...DOCS_FILES, ...DOCS_EXTRA]) {
    const src = path.join(TEMPLATES_DIR, 'docs', file);
    const dest = path.join(docsDir, file);
    if (exists(dest)) {
      console.log(yellow('  ⊘ ') + dim('docs/') + file + dim(' (exists, skipped)'));
      skipped++;
    } else {
      copy(src, dest);
      console.log(green('  ✔ ') + dim('docs/') + file);
      created++;
    }
  }

  console.log('');
  if (skipped > 0) {
    console.log(green(`  ✔ Created ${created} files`) + dim(`, skipped ${skipped} existing`));
  } else {
    console.log(green(`  ✔ Created ${created} files in docs/`));
  }
  console.log('');
  console.log(bold('  Next steps:'));
  console.log('');
  console.log('  Tell your AI agent:');
  console.log('');
  console.log(cyan('     "Read .vibe/VIBE_GUIDE.md for context, then analyze'));
  console.log(cyan('      the codebase and fill out all skeleton files in docs/.'));
  console.log(cyan('      Ask me any questions you can\'t answer from the code."'));
  console.log('');
}

function cmdCheck(targetDir) {
  const vibeDir = path.join(targetDir, VIBE_DIR);
  const docsDir = path.join(targetDir, DOCS_DIR);
  const hasVibe = exists(vibeDir);
  const hasDocs = exists(docsDir);

  if (!hasVibe && !hasDocs) {
    console.log(red('\n  ✖ No .vibe/ or docs/ found. Run "vibes init" first.\n'));
    process.exit(1);
  }

  console.log('');
  console.log(bold('  🔍 vibes check'));

  let passed = 0, failed = 0, warnings = 0;

  // Check .vibe/
  if (hasVibe) {
    console.log('');
    console.log(dim('  ── .vibe/ (semantic layer) ──'));
    console.log('');

    for (const file of VIBE_FILES) {
      const fp = path.join(vibeDir, file);
      if (!exists(fp)) { console.log(red('  ✖ ') + file + ' — missing'); failed++; continue; }

      const content = fs.readFileSync(fp, 'utf-8').trim();
      const lines = content.split('\n').length;

      if (lines < 5) { console.log(yellow('  ⚠ ') + file + ` — looks empty (${lines} lines)`); warnings++; continue; }

      // File-specific quality checks
      let warn = null;
      if (file === 'purpose.md' && !content.toLowerCase().includes('not do')) warn = 'missing "NOT do" section';
      if (file === 'decisions.md' && (content.match(/^## Why /gm) || []).length < 2) warn = 'fewer than 2 decisions';
      if (file === 'entities.md' && !content.includes('What depends on it')) warn = 'missing "What depends on it?" fields';
      if (file === 'flows.md' && (content.match(/^## \d+\./gm) || []).length < 2) warn = 'fewer than 2 flows';
      if (file === 'state.json') {
        try {
          const s = JSON.parse(content);
          if (!s.vibe_updated) warn = 'missing vibe_updated timestamp';
          else {
            const days = (Date.now() - new Date(s.vibe_updated).getTime()) / 86400000;
            if (days > 30) warn = `last updated ${Math.floor(days)} days ago`;
          }
        } catch { console.log(red('  ✖ ') + file + ' — invalid JSON'); failed++; continue; }
      }

      if (warn) { console.log(yellow('  ⚠ ') + file + ` — ${warn}`); warnings++; }
      else { console.log(green('  ✔ ') + file + ` — ${lines} lines`); passed++; }
    }
  }

  // Check docs/
  if (hasDocs) {
    console.log('');
    console.log(dim('  ── docs/ (operational docs) ──'));
    console.log('');

    for (const file of DOCS_FILES) {
      const fp = path.join(docsDir, file);
      if (!exists(fp)) { console.log(yellow('  ⚠ ') + file + ' — missing'); warnings++; continue; }

      const content = fs.readFileSync(fp, 'utf-8').trim();
      const lines = content.split('\n').length;

      if (lines < 5) { console.log(yellow('  ⚠ ') + file + ` — looks empty (${lines} lines)`); warnings++; }
      else { console.log(green('  ✔ ') + file + ` — ${lines} lines`); passed++; }
    }
  }

  console.log('');
  if (failed > 0) console.log(red(`  Result: ${failed} failed, ${warnings} warnings, ${passed} passed`));
  else if (warnings > 0) console.log(yellow(`  Result: ${warnings} warnings, ${passed} passed`));
  else console.log(green(`  Result: All ${passed} files pass ✔`));
  console.log('');
}

function cmdStatus(targetDir) {
  const vibeDir = path.join(targetDir, VIBE_DIR);
  const docsDir = path.join(targetDir, DOCS_DIR);
  const name = getProjectName(targetDir);

  console.log('');
  console.log(bold(`  📊 ${name}`));
  console.log('');

  // .vibe status
  if (exists(vibeDir)) {
    const filled = VIBE_FILES.filter(f => {
      const fp = path.join(vibeDir, f);
      if (!exists(fp)) return false;
      return fs.readFileSync(fp, 'utf-8').trim().split('\n').length >= 10;
    }).length;
    const icon = filled === VIBE_FILES.length ? green('✔') : filled > 0 ? yellow('◐') : red('✖');
    console.log(`  ${icon} .vibe/   ${filled}/${VIBE_FILES.length} files filled`);

    // Show state.json health if available
    const statePath = path.join(vibeDir, 'state.json');
    if (exists(statePath)) {
      try {
        const s = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
        if (s.health) console.log(dim(`             health: ${s.health}`));
        if (s.version) console.log(dim(`             version: ${s.version}`));
        if (s.vibe_updated) {
          const days = Math.floor((Date.now() - new Date(s.vibe_updated).getTime()) / 86400000);
          console.log(dim(`             updated: ${days === 0 ? 'today' : days + ' days ago'}`));
        }
      } catch {}
    }
  } else {
    console.log(red('  ✖') + ' .vibe/   not initialized');
  }

  // docs status
  if (exists(docsDir)) {
    const filled = DOCS_FILES.filter(f => {
      const fp = path.join(docsDir, f);
      if (!exists(fp)) return false;
      return fs.readFileSync(fp, 'utf-8').trim().split('\n').length >= 10;
    }).length;
    const icon = filled === DOCS_FILES.length ? green('✔') : filled > 0 ? yellow('◐') : red('✖');
    console.log(`  ${icon} docs/    ${filled}/${DOCS_FILES.length} files filled`);
  } else {
    console.log(red('  ✖') + ' docs/    not initialized');
  }

  console.log('');
}

function cmdAll(targetDir) {
  console.log('');
  console.log(bold('  🚀 vibes all'));
  console.log(dim('  Full setup — semantic layer + operational docs'));

  const vibeDir = path.join(targetDir, VIBE_DIR);
  const docsDir = path.join(targetDir, DOCS_DIR);

  if (!exists(vibeDir)) {
    cmdInit(targetDir);
  } else {
    console.log(yellow('\n  ⊘ .vibe/ already exists, skipping init'));
  }

  if (!exists(docsDir) || fs.readdirSync(docsDir).length === 0) {
    cmdDocs(targetDir);
  } else {
    cmdDocs(targetDir); // docs command already handles existing files gracefully
  }
}

function cmdReset(targetDir) {
  for (const dir of [VIBE_DIR, DOCS_DIR]) {
    const p = path.join(targetDir, dir);
    if (exists(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(yellow(`\n  ⚠ Removed ${dir}/`));
    }
  }
  cmdAll(targetDir);
}

function printNextSteps() {
  console.log('');
  console.log(bold('  Next steps:'));
  console.log('');
  console.log('  1. Point your AI coding agent at this project');
  console.log('  2. Tell it:');
  console.log('');
  console.log(cyan('     "Read .vibe/VIBE_GUIDE.md, then analyze this codebase'));
  console.log(cyan('      and fill out all the skeleton files in .vibe/'));
  console.log(cyan('      Ask me any questions you can\'t answer from the code."'));
  console.log('');
  console.log('  3. Run ' + cyan('vibes docs') + ' to scaffold operational docs too');
  console.log('  4. Review the output, commit to version control');
  console.log('');
}

function printHelp() {
  console.log('');
  console.log(bold('  vibes') + ' — Semantic layers + standardized docs for humans and AI');
  console.log('');
  console.log('  ' + bold('Usage:'));
  console.log('');
  console.log('    vibes init      Create .vibe/ semantic layer (6 files)');
  console.log('    vibes docs      Create docs/ operational documentation (11 files)');
  console.log('    vibes all       Create both .vibe/ and docs/ at once');
  console.log('    vibes check     Validate all files for completeness');
  console.log('    vibes status    Quick health overview');
  console.log('    vibes reset     Delete and recreate everything');
  console.log('    vibes help      Show this help message');
  console.log('');
  console.log('  ' + bold('.vibe/') + dim(' — Semantic layer (intent, decisions, flows)'));
  console.log('  ' + dim('├── purpose.md       — What is this? Who is it for?'));
  console.log('  ' + dim('├── architecture.md  — Systems and how they connect'));
  console.log('  ' + dim('├── flows.md         — User journeys, step by step'));
  console.log('  ' + dim('├── entities.md      — Important nouns and relationships'));
  console.log('  ' + dim('├── decisions.md     — Why things exist the way they do'));
  console.log('  ' + dim('└── state.json       — Machine-readable project health'));
  console.log('');
  console.log('  ' + bold('docs/') + dim(' — Operational docs (topology, API, issues, guides)'));
  console.log('  ' + dim('├── README.md          — Executive summary'));
  console.log('  ' + dim('├── topology.md        — File/folder map'));
  console.log('  ' + dim('├── architecture.md    — Component-level details'));
  console.log('  ' + dim('├── api.md             — API endpoints'));
  console.log('  ' + dim('├── issues.md          — Open bugs and blockers'));
  console.log('  ' + dim('├── resolved.md        — Closed issues archive'));
  console.log('  ' + dim('├── roadmap.md         — Milestones and priorities'));
  console.log('  ' + dim('├── developer_guide.md — Setup, build, test, deploy'));
  console.log('  ' + dim('├── troubleshooting.md — Common errors and fixes'));
  console.log('  ' + dim('├── glossary.md        — Project-specific terms'));
  console.log('  ' + dim('└── decisions/         — Architecture decision records'));
  console.log('');
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0] || 'help';
const targetDir = path.resolve(args[1] || '.');

switch (command) {
  case 'init':    cmdInit(targetDir); break;
  case 'docs':    cmdDocs(targetDir); break;
  case 'all':     cmdAll(targetDir); break;
  case 'check':   cmdCheck(targetDir); break;
  case 'status':  cmdStatus(targetDir); break;
  case 'reset':   cmdReset(targetDir); break;
  case 'help': case '--help': case '-h': printHelp(); break;
  default:
    console.log(red(`\n  Unknown command: ${command}`));
    printHelp();
    process.exit(1);
}
