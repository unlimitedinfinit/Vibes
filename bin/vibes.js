#!/usr/bin/env node

// vibes — Create a .vibe/ semantic layer for any project
// Zero dependencies. Single file. Works with npx.

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const VIBE_DIR = '.vibe';
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const SPEC_DIR = path.join(__dirname, '..', 'spec');

const TEMPLATE_FILES = [
  'purpose.md',
  'architecture.md',
  'flows.md',
  'entities.md',
  'decisions.md',
  'state.json'
];

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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function fileExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function copyFile(src, dest) {
  const content = fs.readFileSync(src, 'utf-8');
  fs.writeFileSync(dest, content, 'utf-8');
}

function getProjectName(dir) {
  // Try package.json
  const pkgPath = path.join(dir, 'package.json');
  if (fileExists(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.name) return pkg.name;
    } catch {}
  }
  // Try Cargo.toml
  const cargoPath = path.join(dir, 'Cargo.toml');
  if (fileExists(cargoPath)) {
    try {
      const cargo = fs.readFileSync(cargoPath, 'utf-8');
      const match = cargo.match(/^name\s*=\s*"(.+)"/m);
      if (match) return match[1];
    } catch {}
  }
  // Try go.mod
  const goModPath = path.join(dir, 'go.mod');
  if (fileExists(goModPath)) {
    try {
      const goMod = fs.readFileSync(goModPath, 'utf-8');
      const match = goMod.match(/^module\s+(.+)/m);
      if (match) return match[1].split('/').pop();
    } catch {}
  }
  // Try pyproject.toml
  const pyPath = path.join(dir, 'pyproject.toml');
  if (fileExists(pyPath)) {
    try {
      const py = fs.readFileSync(pyPath, 'utf-8');
      const match = py.match(/^name\s*=\s*"(.+)"/m);
      if (match) return match[1];
    } catch {}
  }
  // Fallback to directory name
  return path.basename(dir);
}

function getNow() {
  return new Date().toISOString();
}

// ─────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────

function cmdInit(targetDir) {
  const vibeDir = path.join(targetDir, VIBE_DIR);
  const projectName = getProjectName(targetDir);

  // Check if .vibe already exists
  if (fileExists(vibeDir)) {
    console.log(red('\n  ✖ .vibe/ already exists in this directory.'));
    console.log(dim('    Use "vibes reset" to overwrite, or edit files directly.\n'));
    process.exit(1);
  }

  console.log('');
  console.log(bold('  ⚡ vibes init'));
  console.log(dim(`  Creating .vibe/ semantic layer for ${cyan(projectName)}`));
  console.log('');

  // Create .vibe directory
  fs.mkdirSync(vibeDir, { recursive: true });

  // Copy template files
  let created = 0;
  for (const file of TEMPLATE_FILES) {
    const src = path.join(TEMPLATES_DIR, file);
    const dest = path.join(vibeDir, file);

    if (file === 'state.json') {
      // Inject project name and timestamp into state.json
      let content = fs.readFileSync(src, 'utf-8');
      content = content.replace('PROJECT_NAME', projectName);
      content = content.replace('TIMESTAMP', getNow());
      fs.writeFileSync(dest, content, 'utf-8');
    } else {
      // Copy markdown templates as-is
      copyFile(src, dest);
    }

    console.log(green('  ✔ ') + dim('.vibe/') + file);
    created++;
  }

  // Copy the guide as a hidden instruction file inside .vibe
  const guideSrc = path.join(SPEC_DIR, SPEC_FILE);
  const guideDest = path.join(vibeDir, SPEC_FILE);
  copyFile(guideSrc, guideDest);
  console.log(green('  ✔ ') + dim('.vibe/') + SPEC_FILE + dim(' (agent instructions)'));
  created++;

  console.log('');
  console.log(green(`  ✔ Created ${created} files in .vibe/`));
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
  console.log('  3. Review the output, commit to version control');
  console.log('');
  console.log(dim('  The guide contains full instructions, examples, and'));
  console.log(dim('  quality checklists for the AI to follow.'));
  console.log('');
}

function cmdCheck(targetDir) {
  const vibeDir = path.join(targetDir, VIBE_DIR);

  if (!fileExists(vibeDir)) {
    console.log(red('\n  ✖ No .vibe/ folder found. Run "vibes init" first.\n'));
    process.exit(1);
  }

  console.log('');
  console.log(bold('  🔍 vibes check'));
  console.log('');

  let passed = 0;
  let failed = 0;
  let warnings = 0;

  // Check each file exists and is non-empty
  for (const file of TEMPLATE_FILES) {
    const filePath = path.join(vibeDir, file);
    if (!fileExists(filePath)) {
      console.log(red('  ✖ ') + `${file} — missing`);
      failed++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const lines = content.split('\n').length;

    if (lines < 5) {
      console.log(yellow('  ⚠ ') + `${file} — exists but looks empty (${lines} lines)`);
      warnings++;
      continue;
    }

    // File-specific checks
    if (file === 'purpose.md') {
      if (!content.includes('NOT do') && !content.includes('not do') && !content.includes('NOT Do')) {
        console.log(yellow('  ⚠ ') + `${file} — missing "What does it explicitly NOT do?" section`);
        warnings++;
        continue;
      }
    }

    if (file === 'decisions.md') {
      // Check for at least 2 "## Why" headings
      const decisionCount = (content.match(/^## Why /gm) || []).length;
      if (decisionCount < 2) {
        console.log(yellow('  ⚠ ') + `${file} — only ${decisionCount} decision(s). Most projects have 3+.`);
        warnings++;
        continue;
      }
    }

    if (file === 'entities.md') {
      if (!content.includes('What depends on it')) {
        console.log(yellow('  ⚠ ') + `${file} — entities missing "What depends on it?" field`);
        warnings++;
        continue;
      }
    }

    if (file === 'state.json') {
      try {
        const state = JSON.parse(content);
        if (!state.vibe_updated) {
          console.log(yellow('  ⚠ ') + `${file} — missing vibe_updated timestamp`);
          warnings++;
          continue;
        }
        // Check staleness
        const updated = new Date(state.vibe_updated);
        const daysOld = (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
        if (daysOld > 30) {
          console.log(yellow('  ⚠ ') + `${file} — last updated ${Math.floor(daysOld)} days ago. Consider refreshing.`);
          warnings++;
          continue;
        }
      } catch {
        console.log(red('  ✖ ') + `${file} — invalid JSON`);
        failed++;
        continue;
      }
    }

    if (file === 'flows.md') {
      const flowCount = (content.match(/^## \d+\./gm) || []).length;
      if (flowCount < 2) {
        console.log(yellow('  ⚠ ') + `${file} — only ${flowCount} flow(s). Most projects have 2+.`);
        warnings++;
        continue;
      }
    }

    console.log(green('  ✔ ') + `${file} — ${lines} lines`);
    passed++;
  }

  console.log('');
  if (failed > 0) {
    console.log(red(`  Result: ${failed} failed, ${warnings} warnings, ${passed} passed`));
  } else if (warnings > 0) {
    console.log(yellow(`  Result: ${warnings} warnings, ${passed} passed`));
  } else {
    console.log(green(`  Result: All ${passed} files pass ✔`));
  }
  console.log('');
}

function cmdReset(targetDir) {
  const vibeDir = path.join(targetDir, VIBE_DIR);

  if (fileExists(vibeDir)) {
    // Remove existing .vibe
    fs.rmSync(vibeDir, { recursive: true, force: true });
    console.log(yellow('\n  ⚠ Removed existing .vibe/ folder'));
  }

  cmdInit(targetDir);
}

function printHelp() {
  console.log('');
  console.log(bold('  vibes') + ' — Semantic repository layers for humans and AI');
  console.log('');
  console.log('  ' + bold('Usage:'));
  console.log('');
  console.log('    vibes init      Create .vibe/ skeleton in the current directory');
  console.log('    vibes check     Validate .vibe/ files for completeness');
  console.log('    vibes reset     Delete and recreate .vibe/ skeleton');
  console.log('    vibes help      Show this help message');
  console.log('');
  console.log('  ' + bold('What is .vibe?'));
  console.log('');
  console.log('  A small set of 6 files that lets any human or AI understand');
  console.log('  a project without reading the source code.');
  console.log('');
  console.log('  ' + dim('.vibe/'));
  console.log('  ' + dim('├── purpose.md       — What is this? Who is it for?'));
  console.log('  ' + dim('├── architecture.md  — Systems and how they connect'));
  console.log('  ' + dim('├── flows.md         — User journeys, step by step'));
  console.log('  ' + dim('├── entities.md      — Important nouns and relationships'));
  console.log('  ' + dim('├── decisions.md     — Why things exist the way they do'));
  console.log('  ' + dim('└── state.json       — Machine-readable project health'));
  console.log('');
  console.log('  After running ' + cyan('vibes init') + ', point your AI coding agent');
  console.log('  at the project and tell it to read ' + cyan('.vibe/VIBE_GUIDE.md') + '.');
  console.log('  The guide contains everything the agent needs to analyze');
  console.log('  your codebase and fill out the semantic layer.');
  console.log('');
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0] || 'help';
const targetDir = path.resolve(args[1] || '.');

switch (command) {
  case 'init':
    cmdInit(targetDir);
    break;
  case 'check':
    cmdCheck(targetDir);
    break;
  case 'reset':
    cmdReset(targetDir);
    break;
  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;
  default:
    console.log(red(`\n  Unknown command: ${command}`));
    printHelp();
    process.exit(1);
}
