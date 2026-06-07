#!/usr/bin/env node

// vibes — The complete semantic layer for any project
// Repository memory + Product memory + Business memory + AI instructions
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

// All .vibe/ files — the full suite, always installed
const VIBE_FILES = [
  // Core — repository memory
  'purpose.md', 'architecture.md', 'flows.md',
  'entities.md', 'decisions.md', 'state.json',
  // Living context
  'context.md',
  // AI agent guide
  'ai.md',
  // Product memory
  'product.md', 'users.md', 'metrics.md', 'experiments.md',
  // Business memory
  'business.md', 'market.md', 'risks.md',
];

// All docs/ files
const DOCS_FILES = [
  'README.md', 'topology.md', 'architecture.md', 'api.md',
  'issues.md', 'resolved.md', 'roadmap.md', 'developer_guide.md',
  'troubleshooting.md', 'glossary.md'
];

const DOCS_DIRS = ['decisions'];
const DOCS_EXTRA = ['decisions/0001-template.md'];
const SPEC_FILE = 'VIBE_GUIDE.md';

// ─────────────────────────────────────────────
// Colors (raw ANSI, zero dependencies)
// ─────────────────────────────────────────────

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

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
    ['setup.py', /name\s*=\s*['"](.+?)['"]/m],
    ['CMakeLists.txt', /project\s*\(\s*(\S+)/m],
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
  console.log(dim(`  Creating .vibe/ for ${cyan(name)} — full suite`));
  console.log('');

  fs.mkdirSync(vibeDir, { recursive: true });

  // Group labels for visual output
  const groups = {
    'purpose.md': '── Core (repository memory) ──',
    'context.md': '── Living Context ──',
    'ai.md': '── AI Agent Guide ──',
    'product.md': '── Product Memory ──',
    'business.md': '── Business Memory ──',
  };

  let count = 0;
  for (const file of VIBE_FILES) {
    if (groups[file]) console.log(dim(`  ${groups[file]}`));

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
  console.log('');
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
    const contents = fs.readdirSync(docsDir);
    if (contents.length > 0) {
      console.log(yellow('\n  ⚠ docs/ already exists with ' + contents.length + ' items.'));
      console.log(dim('    Adding missing files only.\n'));
    }
  }

  console.log('');
  console.log(bold('  📄 vibes docs'));
  console.log(dim(`  Creating docs/ for ${cyan(name)}`));
  console.log('');

  fs.mkdirSync(docsDir, { recursive: true });
  for (const sub of DOCS_DIRS) {
    fs.mkdirSync(path.join(docsDir, sub), { recursive: true });
  }

  let created = 0, skipped = 0;
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
  if (skipped > 0) console.log(green(`  ✔ Created ${created} files`) + dim(`, skipped ${skipped} existing`));
  else console.log(green(`  ✔ Created ${created} files in docs/`));
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

  let passed = 0, failed = 0, warnings = 0, na = 0;

  if (hasVibe) {
    console.log('');
    console.log(dim('  ── .vibe/ ──'));
    console.log('');

    for (const file of VIBE_FILES) {
      const fp = path.join(vibeDir, file);
      if (!exists(fp)) { console.log(red('  ✖ ') + file + ' — missing'); failed++; continue; }

      const content = fs.readFileSync(fp, 'utf-8').trim();
      const lines = content.split('\n').length;

      // Check for N/A files (product/business layers marked not applicable)
      if (content.match(/^N\/A/m) || content.match(/^"?N\/A/m)) {
        console.log(dim('  ⊘ ') + file + dim(' — N/A (not applicable)'));
        na++;
        continue;
      }

      if (lines < 5) { console.log(yellow('  ⚠ ') + file + ` — looks empty (${lines} lines)`); warnings++; continue; }

      // File-specific checks
      let warn = null;
      if (file === 'purpose.md' && !content.toLowerCase().includes('not do')) warn = 'missing "NOT do" section';
      if (file === 'decisions.md' && (content.match(/^## Why /gm) || []).length < 2) warn = 'fewer than 2 decisions';
      if (file === 'entities.md' && !content.includes('What depends on it')) warn = 'missing dependency fields';
      if (file === 'flows.md' && (content.match(/^## \d+\./gm) || []).length < 2) warn = 'fewer than 2 flows';
      if (file === 'state.json') {
        try {
          const s = JSON.parse(content);
          if (!s.vibe_updated) warn = 'missing vibe_updated';
          else {
            const days = (Date.now() - new Date(s.vibe_updated).getTime()) / 86400000;
            if (days > 30) warn = `stale (${Math.floor(days)} days old)`;
          }
        } catch { console.log(red('  ✖ ') + file + ' — invalid JSON'); failed++; continue; }
      }
      if (file === 'context.md') {
        if (!content.includes('## Current Focus') || content.match(/^- $/m)) warn = 'Current Focus is empty';
      }
      if (file === 'decisions.md' && !content.includes('Depends On') && !content.includes('Threatened By')) {
        // Only warn if decisions exist but lack graph relationships
        if ((content.match(/^## Why /gm) || []).length >= 2) warn = 'decisions missing relationship fields (Depends On, Threatened By)';
      }

      if (warn) { console.log(yellow('  ⚠ ') + file + ` — ${warn}`); warnings++; }
      else { console.log(green('  ✔ ') + file + ` — ${lines} lines`); passed++; }
    }
  }

  if (hasDocs) {
    console.log('');
    console.log(dim('  ── docs/ ──'));
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
  let result = '';
  if (failed > 0) result = red(`${failed} failed`);
  if (warnings > 0) result += (result ? ', ' : '') + yellow(`${warnings} warnings`);
  if (na > 0) result += (result ? ', ' : '') + dim(`${na} N/A`);
  result += (result ? ', ' : '') + green(`${passed} passed`);
  console.log(`  Result: ${result}`);
  console.log('');
}

function cmdStatus(targetDir) {
  const vibeDir = path.join(targetDir, VIBE_DIR);
  const docsDir = path.join(targetDir, DOCS_DIR);
  const name = getProjectName(targetDir);

  console.log('');
  console.log(bold(`  📊 ${name}`));
  console.log('');

  if (exists(vibeDir)) {
    // Count filled vs N/A vs empty
    let filled = 0, naCount = 0, empty = 0;
    for (const f of VIBE_FILES) {
      const fp = path.join(vibeDir, f);
      if (!exists(fp)) { empty++; continue; }
      const content = fs.readFileSync(fp, 'utf-8').trim();
      if (content.match(/^N\/A/m)) naCount++;
      else if (content.split('\n').length >= 10) filled++;
      else empty++;
    }
    const icon = empty === 0 ? green('✔') : filled > 0 ? yellow('◐') : red('✖');
    console.log(`  ${icon} .vibe/   ${filled} filled, ${naCount} N/A, ${empty} empty  (${VIBE_FILES.length} total)`);

    const statePath = path.join(vibeDir, 'state.json');
    if (exists(statePath)) {
      try {
        const s = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
        if (s.health) console.log(dim(`             health: ${s.health}`));
        if (s.vibe_updated) {
          const days = Math.floor((Date.now() - new Date(s.vibe_updated).getTime()) / 86400000);
          console.log(dim(`             updated: ${days === 0 ? 'today' : days + ' days ago'}`));
        }
      } catch {}
    }
  } else {
    console.log(red('  ✖') + ' .vibe/   not initialized');
  }

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

  if (!exists(vibeDir)) cmdInit(targetDir);
  else console.log(yellow('\n  ⊘ .vibe/ already exists, skipping init'));

  cmdDocs(targetDir);
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
  console.log(bold('  What to do next:'));
  console.log('');
  console.log('  Tell your AI coding agent:');
  console.log('');
  console.log(cyan('     "Read .vibe/VIBE_GUIDE.md, then analyze this codebase'));
  console.log(cyan('      and fill out all the skeleton files in .vibe/ and docs/.'));
  console.log(cyan('      For files that aren\'t relevant (like business.md for a'));
  console.log(cyan('      library), write N/A with a brief explanation.'));
  console.log(cyan('      Ask me any questions you can\'t answer from the code."'));
  console.log('');
}

function printHelp() {
  console.log('');
  console.log(bold('  vibes') + ' — The complete semantic layer for any project');
  console.log('');
  console.log('  ' + bold('Usage:'));
  console.log('');
  console.log('    vibes init      Create .vibe/ with the full suite (15 files + guide)');
  console.log('    vibes docs      Create docs/ operational documentation (11 files)');
  console.log('    vibes all       Create both .vibe/ and docs/ at once');
  console.log('    vibes check     Validate all files for completeness');
  console.log('    vibes status    Quick health dashboard');
  console.log('    vibes reset     Delete and recreate everything');
  console.log('    vibes help      Show this help message');
  console.log('');
  console.log('  ' + bold('.vibe/') + dim(' — Project memory'));
  console.log(dim('  Core:      purpose · architecture · flows · entities · decisions · state'));
  console.log(dim('  Context:   context (living state, updated weekly)'));
  console.log(dim('  AI:        ai (agent constraints, safe zones, rules)'));
  console.log(dim('  Product:   product · users · metrics · experiments'));
  console.log(dim('  Business:  business · market · risks'));
  console.log('');
  console.log('  ' + bold('docs/') + dim(' — Operational documentation'));
  console.log(dim('  README · topology · architecture · api · issues · resolved'));
  console.log(dim('  roadmap · developer_guide · troubleshooting · glossary · decisions/'));
  console.log('');
  console.log(dim('  Files that aren\'t relevant to your project? Mark them N/A.'));
  console.log(dim('  Your AI agent will figure out which ones apply.'));
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
