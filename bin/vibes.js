#!/usr/bin/env node

// vibes — The complete semantic layer for any project
// Repository memory + Product memory + Business memory + AI instructions
// Zero dependencies. Single file. Works with npx.

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const CLI_VERSION = require(path.join(__dirname, '..', 'package.json')).version;
const VIBE_DIR = '.vibe';
const DOCS_DIR = 'docs';
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const SPEC_DIR = path.join(__dirname, '..', 'spec');
const HUB_CONFIG = path.join(process.env.USERPROFILE || process.env.HOME || '', '.vibes-hub');

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

  // ─── Universal quality checks ───
  function checkQuality(content, file) {
    const issues = [];

    // FAIL: Still has template instruction comments
    if (content.includes('INSTRUCTIONS FOR AI AGENT')) {
      issues.push({ level: 'fail', msg: 'still contains template instructions (unfilled)' });
      return issues;
    }

    // FAIL: Too short to be real content
    const lines = content.split('\n').length;
    if (lines < 8) {
      issues.push({ level: 'fail', msg: `only ${lines} lines — needs real content` });
      return issues;
    }

    // WARN: Has unfilled placeholder brackets like [Component Name]
    const placeholders = content.match(/\[(?:Component|Persona|Experiment|Decision|Error|Deliverable|Feature|Issue)\s*\w*\]/gi);
    if (placeholders && placeholders.length > 1) {
      issues.push({ level: 'warn', msg: `${placeholders.length} unfilled placeholders (${placeholders[0]}, ...)` });
    }

    // WARN: Empty bullet points (lines that are just "- " or "- \n")
    const emptyBullets = (content.match(/^- ?\s*$/gm) || []).length;
    if (emptyBullets > 2) {
      issues.push({ level: 'warn', msg: `${emptyBullets} empty bullet points` });
    }

    // WARN: Empty table rows (| | | |)
    const emptyRows = (content.match(/^\|\s*\|\s*\|\s*\|/gm) || []).length;
    if (emptyRows > 1) {
      issues.push({ level: 'warn', msg: `${emptyRows} empty table rows` });
    }

    return issues;
  }

  // ─── File-specific structure checks ───
  function checkStructure(content, file) {
    const issues = [];

    switch (file) {
      case 'purpose.md':
        if (!content.toLowerCase().includes('not do') && !content.toLowerCase().includes('does not'))
          issues.push({ level: 'warn', msg: 'missing "NOT do" / scope boundary section' });
        if (!content.toLowerCase().includes('who'))
          issues.push({ level: 'warn', msg: 'doesn\'t mention who uses it' });
        break;

      case 'architecture.md':
        if (!content.includes('→') && !content.includes('->') && !content.includes('connects') && !content.includes('talks to'))
          issues.push({ level: 'warn', msg: 'no data flow described (missing → or connection language)' });
        break;

      case 'flows.md':
        const flowHeaders = (content.match(/^##\s+/gm) || []).length;
        if (flowHeaders < 2) issues.push({ level: 'warn', msg: `only ${flowHeaders} flow(s) — most projects have 3+` });
        break;

      case 'entities.md':
        if (!content.toLowerCase().includes('depends') && !content.toLowerCase().includes('relationship'))
          issues.push({ level: 'warn', msg: 'no dependency/relationship info for entities' });
        break;

      case 'decisions.md':
        const decisionHeaders = (content.match(/^##\s+/gm) || []).length;
        if (decisionHeaders < 2) issues.push({ level: 'warn', msg: `only ${decisionHeaders} decision(s) — aim for 3+` });
        if (!content.includes('Depends On') && !content.includes('Threatened By') && !content.includes('depends on'))
          issues.push({ level: 'warn', msg: 'no dependency graph fields (Depends On, Threatened By)' });
        break;

      case 'state.json':
        try {
          const s = JSON.parse(content);
          if (!s.vibe_updated) issues.push({ level: 'warn', msg: 'missing vibe_updated timestamp' });
          else {
            const days = (Date.now() - new Date(s.vibe_updated).getTime()) / 86400000;
            if (days > 30) issues.push({ level: 'warn', msg: `last updated ${Math.floor(days)} days ago — stale?` });
          }
          if (!s.project) issues.push({ level: 'warn', msg: 'missing project name' });
        } catch {
          issues.push({ level: 'fail', msg: 'invalid JSON' });
        }
        break;

      case 'context.md':
        if (!content.includes('## Current Focus'))
          issues.push({ level: 'warn', msg: 'missing "Current Focus" section' });
        else {
          const focusIdx = content.indexOf('## Current Focus');
          const nextSection = content.indexOf('##', focusIdx + 16);
          const focusContent = content.substring(focusIdx, nextSection > 0 ? nextSection : undefined);
          const focusBullets = (focusContent.match(/^- .{3,}/gm) || []).length;
          if (focusBullets === 0) issues.push({ level: 'warn', msg: 'Current Focus has no entries' });
        }
        break;

      case 'ai.md':
        if (!content.toLowerCase().includes('never') && !content.toLowerCase().includes('don\'t') && !content.toLowerCase().includes('do not'))
          issues.push({ level: 'warn', msg: 'no constraints defined — what should agents NOT touch?' });
        break;

      case 'product.md':
        if (!content.toLowerCase().includes('retention') && !content.toLowerCase().includes('why') && !content.toLowerCase().includes('value'))
          issues.push({ level: 'warn', msg: 'missing value prop or retention drivers' });
        break;

      case 'users.md':
        if (!content.toLowerCase().includes('frustrat') && !content.toLowerCase().includes('fear') && !content.toLowerCase().includes('pain') && !content.toLowerCase().includes('goal'))
          issues.push({ level: 'warn', msg: 'missing emotional reality (frustrations, fears, goals)' });
        break;
    }

    return issues;
  }

  // ─── Run checks on .vibe/ ───
  if (hasVibe) {
    console.log('');
    console.log(dim('  ── .vibe/ ──'));
    console.log('');

    for (const file of VIBE_FILES) {
      const fp = path.join(vibeDir, file);
      if (!exists(fp)) { console.log(red('  ✖ ') + file + ' — missing'); failed++; continue; }

      const content = fs.readFileSync(fp, 'utf-8').trim();
      const lines = content.split('\n').length;

      // N/A check
      if (content.match(/^N\/A/m)) {
        console.log(dim('  ⊘ ') + file + dim(' — N/A (not applicable)'));
        na++;
        continue;
      }

      // Run quality + structure checks
      const allIssues = [...checkQuality(content, file), ...checkStructure(content, file)];
      const fails = allIssues.filter(i => i.level === 'fail');
      const warns = allIssues.filter(i => i.level === 'warn');

      if (fails.length > 0) {
        console.log(red('  ✖ ') + file + ' — ' + fails[0].msg);
        failed++;
      } else if (warns.length > 0) {
        console.log(yellow('  ⚠ ') + file + ` — ${lines} lines` + yellow(` (${warns.map(w => w.msg).join('; ')})`));
        warnings++;
      } else {
        console.log(green('  ✔ ') + file + ` — ${lines} lines`);
        passed++;
      }
    }
  }

  // ─── Run checks on docs/ ───
  if (hasDocs) {
    console.log('');
    console.log(dim('  ── docs/ ──'));
    console.log('');

    // Check for non-lowercase filenames in docs/
    try {
      const actualFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
      for (const f of actualFiles) {
        if (f !== 'README.md' && f !== f.toLowerCase()) {
          console.log(yellow('  ⚠ ') + f + yellow(' — should be lowercase (' + f.toLowerCase() + ')'));
          warnings++;
        }
      }
    } catch {}

    for (const file of DOCS_FILES) {
      const fp = path.join(docsDir, file);
      if (!exists(fp)) { console.log(yellow('  ⚠ ') + file + ' — missing'); warnings++; continue; }

      const content = fs.readFileSync(fp, 'utf-8').trim();
      const lines = content.split('\n').length;

      const allIssues = checkQuality(content, file);
      const fails = allIssues.filter(i => i.level === 'fail');
      const warns = allIssues.filter(i => i.level === 'warn');

      if (fails.length > 0) {
        console.log(red('  ✖ ') + file + ' — ' + fails[0].msg);
        failed++;
      } else if (warns.length > 0) {
        console.log(yellow('  ⚠ ') + file + ` — ${lines} lines` + yellow(` (${warns.map(w => w.msg).join('; ')})`));
        warnings++;
      } else {
        console.log(green('  ✔ ') + file + ` — ${lines} lines`);
        passed++;
      }
    }
  }

  // ─── Cross-check: vibe_version staleness ───
  const stateFile = path.join(vibeDir, 'state.json');
  if (hasVibe && exists(stateFile)) {
    try {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
      if (state.vibe_version && state.vibe_version !== CLI_VERSION) {
        const major = (v) => (v || '').split('.')[0];
        if (major(state.vibe_version) !== major(CLI_VERSION)) {
          console.log('');
          console.log(yellow('  ⚠ ') + `vibe_version in state.json is ${state.vibe_version}, CLI is ${CLI_VERSION}`);
          warnings++;
        }
      }
    } catch {}
  }

  // ─── Summary ───
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

function copyDirRecursive(src, dest) {
  if (!exists(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      count += copyDirRecursive(srcPath, destPath);
    } else {
      if (item === 'VIBE_GUIDE.md') continue;
      fs.writeFileSync(destPath, fs.readFileSync(srcPath));
      count++;
    }
  }
  return count;
}

function cmdExport(targetDir, hubPathArg) {
  targetDir = path.resolve(targetDir);
  let hubPath = hubPathArg;
  if (!hubPath && exists(HUB_CONFIG)) {
    hubPath = fs.readFileSync(HUB_CONFIG, 'utf-8').trim();
  }
  if (!hubPath) {
    console.log(red('\n  ✖ No hub path specified.'));
    console.log('');
    console.log('  First time? Set your hub path:');
    console.log(cyan('    vibes hub C:\\Users\\You\\Documents\\VibeHub'));
    console.log('');
    console.log('  Then run:');
    console.log(cyan('    vibes export'));
    console.log('');
    process.exit(1);
  }

  hubPath = path.resolve(hubPath);
  const name = getProjectName(targetDir);
  const projectHub = path.join(hubPath, name);

  console.log('');
  console.log(bold('  📤 vibes export'));
  console.log(dim(`  Exporting ${cyan(name)} → ${hubPath}`));
  console.log('');

  let total = 0;

  const vibeDir = path.join(targetDir, VIBE_DIR);
  if (exists(vibeDir)) {
    const count = copyDirRecursive(vibeDir, path.join(projectHub, VIBE_DIR));
    console.log(green('  ✔ ') + `.vibe/ — ${count} files`);
    total += count;
  } else {
    console.log(yellow('  ⚠ ') + '.vibe/ not found, skipping');
  }

  const docsDir = path.join(targetDir, DOCS_DIR);
  if (exists(docsDir)) {
    const count = copyDirRecursive(docsDir, path.join(projectHub, DOCS_DIR));
    console.log(green('  ✔ ') + `docs/ — ${count} files`);
    total += count;
  } else {
    console.log(yellow('  ⚠ ') + 'docs/ not found, skipping');
  }

  const meta = { project: name, exported_at: now(), source: targetDir };
  fs.writeFileSync(path.join(projectHub, 'export.json'), JSON.stringify(meta, null, 2), 'utf-8');
  total++;

  console.log('');
  console.log(green(`  ✔ Exported ${total} files to ${projectHub}`));

  generateHubIndex(hubPath);

  console.log('');
  console.log(dim('  Commit and push your hub repo to sync across machines:'));
  console.log(cyan(`    cd "${hubPath}" && git add -A && git commit -m "export ${name}" && git push`));
  console.log('');
}

function generateHubIndex(hubPath) {
  const projects = [];
  for (const dir of fs.readdirSync(hubPath)) {
    const dirPath = path.join(hubPath, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    if (dir.startsWith('.') || dir.startsWith('_')) continue;

    const exportFile = path.join(dirPath, 'export.json');
    const vibeDir = path.join(dirPath, VIBE_DIR);
    const docsDir = path.join(dirPath, DOCS_DIR);

    let exportedAt = 'unknown';
    if (exists(exportFile)) {
      try {
        const meta = JSON.parse(fs.readFileSync(exportFile, 'utf-8'));
        exportedAt = meta.exported_at ? meta.exported_at.split('T')[0] : 'unknown';
      } catch {}
    }

    let vibeFilled = 0, vibeNA = 0, vibeTotal = 0;
    if (exists(vibeDir)) {
      for (const f of VIBE_FILES) {
        const fp = path.join(vibeDir, f);
        if (!exists(fp)) continue;
        vibeTotal++;
        const content = fs.readFileSync(fp, 'utf-8').trim();
        if (content.match(/^N\/A/m)) vibeNA++;
        else if (content.split('\n').length >= 10) vibeFilled++;
      }
    }

    let docsFilled = 0;
    if (exists(docsDir)) {
      for (const f of DOCS_FILES) {
        const fp = path.join(docsDir, f);
        if (!exists(fp)) continue;
        if (fs.readFileSync(fp, 'utf-8').trim().split('\n').length >= 10) docsFilled++;
      }
    }

    let purpose = '';
    const purposeFile = path.join(vibeDir, 'purpose.md');
    if (exists(purposeFile)) {
      for (const line of fs.readFileSync(purposeFile, 'utf-8').split('\n')) {
        const t = line.trim();
        if (t && !t.startsWith('#') && !t.startsWith('<!--') && !t.startsWith('-->') && !t.startsWith('[')) {
          purpose = t.substring(0, 80);
          break;
        }
      }
    }

    projects.push({ name: dir, exportedAt, vibeFilled, vibeNA, vibeTotal, docsFilled, purpose });
  }

  if (projects.length === 0) return;

  let md = `# Vibes Hub\n\n`;
  md += `> Auto-generated index. Last updated: ${now().split('T')[0]}\n\n`;
  md += `| Project | .vibe/ | docs/ | Last Export | Purpose |\n`;
  md += `|---|---|---|---|---|\n`;
  for (const p of projects.sort((a, b) => a.name.localeCompare(b.name))) {
    const vs = p.vibeTotal > 0 ? `${p.vibeFilled}/${p.vibeTotal}` + (p.vibeNA > 0 ? ` (${p.vibeNA} N/A)` : '') : '—';
    const ds = p.docsFilled > 0 ? `${p.docsFilled}/${DOCS_FILES.length}` : '—';
    md += `| [${p.name}](./${p.name}/) | ${vs} | ${ds} | ${p.exportedAt} | ${p.purpose} |\n`;
  }
  md += `\n---\n\n**${projects.length} projects** tracked.\n`;

  fs.writeFileSync(path.join(hubPath, 'index.md'), md, 'utf-8');
  console.log(green('  ✔ ') + 'Updated hub index.md');
}

function cmdHub(hubPathArg) {
  if (!hubPathArg) {
    if (exists(HUB_CONFIG)) {
      const saved = fs.readFileSync(HUB_CONFIG, 'utf-8').trim();
      console.log(`\n  Hub path: ${cyan(saved)}\n`);
    } else {
      console.log(yellow('\n  No hub configured.'));
      console.log(dim('  Set one with: vibes hub <path>\n'));
    }
    return;
  }

  const resolved = path.resolve(hubPathArg);
  const isNew = !exists(resolved) || fs.readdirSync(resolved).length === 0;

  // Create directory
  fs.mkdirSync(resolved, { recursive: true });

  console.log('');
  console.log(bold('  🗂️  vibes hub setup'));
  console.log('');

  if (isNew) {
    // Initialize git
    const { execSync } = require('child_process');
    try {
      execSync('git init', { cwd: resolved, stdio: 'ignore' });
      console.log(green('  ✔ ') + 'Created directory & initialized git');
    } catch {
      console.log(green('  ✔ ') + 'Created directory');
      console.log(yellow('  ⚠ ') + 'Could not git init (git not found?)');
    }

    // Create README
    const readme = [
      '# Vibes Hub',
      '',
      'Central collection of `.vibe/` and `docs/` files from all my projects.',
      '',
      '## How this works',
      '',
      '1. Run `vibes export` from any project directory',
      '2. Commit and push: `git add -A && git commit -m "update" && git push`',
      '3. Pull on another machine: `git pull`',
      '',
      '## Projects',
      '',
      'See [index.md](index.md) for auto-generated dashboard.',
      '',
      '## Cross-Project Intelligence',
      '',
      'The `_insights/` folder is where AI analyzes patterns across all your projects.',
      '',
      '- **[ANALYZE.md](_insights/ANALYZE.md)** — Copy-paste prompt for your AI agent',
      '- **[patterns.md](_insights/patterns.md)** — Architecture, security, and tech patterns',
      '- **[standards.md](_insights/standards.md)** — Universal rules for all projects',
      '- **[opportunities.md](_insights/opportunities.md)** — What one project can learn from another',
      '',
      'Export 3+ projects, then run the analysis prompt to find cross-project improvements.',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(resolved, 'README.md'), readme, 'utf-8');
    console.log(green('  ✔ ') + 'Created README.md');

    // Create .gitignore
    fs.writeFileSync(path.join(resolved, '.gitignore'), 'node_modules/\n.DS_Store\nThumbs.db\n', 'utf-8');
    console.log(green('  ✔ ') + 'Created .gitignore');

    // Create _insights/ intelligence layer
    const insightsDir = path.join(resolved, '_insights');
    fs.mkdirSync(insightsDir, { recursive: true });

    // Analysis prompt — the AI reads this to know what to do
    const analyze = [
      '# Hub Analysis Prompt',
      '',
      '> Copy-paste this to your AI agent after exporting 3+ projects.',
      '',
      '---',
      '',
      '```',
      'I have a Vibes Hub — a central collection of .vibe/ and docs/ files',
      'from all my projects. Read every project folder in this hub and:',
      '',
      '1. CROSS-PROJECT PATTERNS',
      '   - What architectural patterns appear across multiple projects?',
      '   - What security approaches are used? Are they consistent?',
      '   - What tech stack choices are shared? Where do they diverge?',
      '   - What naming conventions or coding standards are consistent?',
      '',
      '2. BEST PRACTICES TO REPLICATE',
      '   - Which project has the best documentation quality?',
      '   - Which project solved a problem that others still have?',
      '   - What did one project do exceptionally well that could set',
      '     the standard for all projects?',
      '   - Are there security, testing, or deployment practices from',
      '     one project that others are missing?',
      '',
      '3. TRANSFERABLE IMPROVEMENTS',
      '   - For each project, list specific improvements it could adopt',
      '     from another project. Be concrete: "Project A could adopt',
      '     Project B\'s approach to X because Y."',
      '   - Identify shared problems that could have a shared solution.',
      '',
      '4. RISKS AND GAPS',
      '   - Which projects have risks that could affect other projects?',
      '   - Are there shared dependencies that create portfolio risk?',
      '   - Which projects have missing or weak documentation areas?',
      '',
      '5. UNIVERSAL STANDARDS',
      '   - Based on what works best across projects, propose standards',
      '     that should apply to ALL projects going forward.',
      '   - These could be file size limits, security practices, naming',
      '     conventions, documentation requirements, etc.',
      '',
      'Write your findings into the _insights/ folder:',
      '- patterns.md — Cross-project patterns',
      '- standards.md — Proposed universal standards',
      '- opportunities.md — Specific transferable improvements',
      '',
      'Be specific. Reference actual project names and files.',
      '```',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(insightsDir, 'ANALYZE.md'), analyze, 'utf-8');

    // Patterns skeleton
    const patterns = [
      '# Cross-Project Patterns',
      '',
      '> Auto-populated by AI analysis. Run the prompt in ANALYZE.md.',
      '',
      '## Architecture Patterns',
      '',
      '<!-- What architectural approaches appear across multiple projects? -->',
      '',
      '## Security Patterns',
      '',
      '<!-- How do projects handle auth, encryption, secrets? -->',
      '',
      '## Shared Tech Stack',
      '',
      '<!-- Languages, frameworks, databases used across projects -->',
      '',
      '| Technology | Used In | Notes |',
      '|---|---|---|',
      '| | | |',
      '',
      '## Common Anti-Patterns',
      '',
      '<!-- Mistakes or bad patterns that appear in multiple projects -->',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(insightsDir, 'patterns.md'), patterns, 'utf-8');

    // Standards skeleton
    const standards = [
      '# Universal Standards',
      '',
      '> Standards that should apply to ALL projects, based on what works best.',
      '',
      '## Code Standards',
      '',
      '<!-- File size limits, naming conventions, banned patterns -->',
      '',
      '## Documentation Standards',
      '',
      '<!-- What every project must document, minimum quality bar -->',
      '',
      '## Security Standards',
      '',
      '<!-- Auth patterns, encryption requirements, secrets management -->',
      '',
      '## AI Agent Standards',
      '',
      '<!-- Rules every AI agent must follow across all projects -->',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(insightsDir, 'standards.md'), standards, 'utf-8');

    // Opportunities skeleton
    const opportunities = [
      '# Transferable Improvements',
      '',
      '> Specific things one project does well that others should adopt.',
      '',
      '## [Source Project] → [Target Project]',
      '',
      '**What:** [Specific practice or solution]',
      '',
      '**Why:** [Why the target project would benefit]',
      '',
      '**How:** [What the target project needs to change]',
      '',
      '---',
      '',
      '<!-- Copy the template above for each transferable improvement. -->',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(insightsDir, 'opportunities.md'), opportunities, 'utf-8');

    console.log(green('  ✔ ') + 'Created _insights/ (analysis prompt + templates)');
  } else {
    console.log(green('  ✔ ') + 'Directory already exists');
  }

  // Save config
  fs.writeFileSync(HUB_CONFIG, resolved, 'utf-8');
  console.log(green('  ✔ ') + `Hub path saved: ${cyan(resolved)}`);

  console.log('');
  console.log(bold('  Next — connect to GitHub:'));
  console.log('');
  console.log(dim('  1. Go to ') + cyan('github.com/new'));
  console.log(dim('     Name: ') + bold('VibeHub') + dim(' (or whatever you want)'));
  console.log(dim('     Visibility: ') + bold('Private'));
  console.log(dim('     Click "Create repository"'));
  console.log('');
  console.log(dim('  2. Run these commands:'));
  console.log('');
  console.log(cyan(`     cd "${resolved}"`));
  console.log(cyan('     git remote add origin git@github.com:YOUR_USERNAME/VibeHub.git'));
  console.log(cyan('     git add -A && git commit -m "init hub" && git push -u origin main'));
  console.log('');
  console.log(dim('  After that, exporting from any project is just:'));
  console.log('');
  console.log(cyan('     vibes export'));
  console.log(cyan(`     cd "${resolved}" && git add -A && git commit -m "update" && git push`));
  console.log('');
  console.log(dim('  On another computer, clone the repo and run:'));
  console.log(cyan('     vibes hub <path-to-cloned-repo>'));
  console.log('');
}

function cmdInsights(targetDir) {
  if (!exists(HUB_CONFIG)) {
    console.log(red('\n  ✖ No hub configured. Run "vibes hub <path>" first.\n'));
    process.exit(1);
  }

  const hubPath = fs.readFileSync(HUB_CONFIG, 'utf-8').trim();
  const insightsDir = path.join(hubPath, '_insights');

  if (!exists(insightsDir)) {
    console.log(red('\n  ✖ No _insights/ folder in hub. Run the analysis prompt first.\n'));
    process.exit(1);
  }

  const name = getProjectName(targetDir);
  const nameL = name.toLowerCase();

  console.log('');
  console.log(bold(`  💡 vibes insights — ${name}`));

  let totalHits = 0;

  // ─── Scan opportunities.md ───
  const oppFile = path.join(insightsDir, 'opportunities.md');
  if (exists(oppFile)) {
    const content = fs.readFileSync(oppFile, 'utf-8');
    // Split by ## headers
    const sections = content.split(/^## /gm).filter(s => s.trim());
    const relevant = sections.filter(s => s.toLowerCase().includes(nameL));

    if (relevant.length > 0) {
      console.log('');
      console.log(dim('  ── Opportunities ──'));
      console.log('');
      for (const section of relevant) {
        const title = section.split('\n')[0].trim();
        const whatMatch = section.match(/\*\*What:\*\*\s*(.+)/i);
        const what = whatMatch ? whatMatch[1].trim() : '';
        console.log(cyan('  ⚡ ') + title);
        if (what) console.log(dim('     ') + what);
        totalHits++;
      }
    }
  }

  // ─── Scan standards.md ───
  const stdFile = path.join(insightsDir, 'standards.md');
  if (exists(stdFile)) {
    const content = fs.readFileSync(stdFile, 'utf-8');
    const bullets = content.match(/^\d+\.\s+\*\*.+\*\*/gm) || [];

    if (bullets.length > 0) {
      console.log('');
      console.log(dim('  ── Universal Standards ──'));
      console.log('');
      for (const bullet of bullets) {
        const clean = bullet.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '');
        console.log(dim('  ◆ ') + clean);
        totalHits++;
      }
    }
  }

  // ─── Scan patterns.md for anti-patterns mentioning this project ───
  const patFile = path.join(insightsDir, 'patterns.md');
  if (exists(patFile)) {
    const content = fs.readFileSync(patFile, 'utf-8');
    const antiSection = content.split('## Common Anti-Patterns')[1];
    if (antiSection) {
      const items = antiSection.split(/^\d+\./gm).filter(s => s.trim());
      const relevant = items.filter(s => s.toLowerCase().includes(nameL));

      if (relevant.length > 0) {
        console.log('');
        console.log(dim('  ── Anti-Patterns ──'));
        console.log('');
        for (const item of relevant) {
          const title = item.match(/\*\*(.+?)\*\*/)?.[1] || item.split('\n')[0].trim();
          console.log(yellow('  ⚠ ') + title);
          totalHits++;
        }
      }
    }
  }

  console.log('');
  if (totalHits === 0) {
    console.log(dim('  No specific insights found for this project.'));
    console.log(dim('  Export 3+ projects, then run the analysis prompt in _insights/ANALYZE.md.'));
  } else {
    console.log(`  ${totalHits} insights found. Review _insights/ in your hub for full details.`);
  }
  console.log('');
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
  console.log('    vibes init            Create .vibe/ with the full suite (15 files + guide)');
  console.log('    vibes docs            Create docs/ operational documentation (11 files)');
  console.log('    vibes all             Create both .vibe/ and docs/ at once');
  console.log('    vibes check           Validate all files for completeness');
  console.log('    vibes status          Quick health dashboard');
  console.log('    vibes reset           Delete and recreate everything');
  console.log('    vibes insights        Show hub feedback for this project');
  console.log('');
  console.log('  ' + bold('Hub (cross-project sync):'));
  console.log('');
  console.log('    vibes hub <path>      Set your central hub directory (saved globally)');
  console.log('    vibes export          Export .vibe/ + docs/ to your hub');
  console.log('    vibes export <path>   Export to a specific hub path');
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
  case 'export':    cmdExport('.', args[1]); break;
  case 'hub':       cmdHub(args[1]); break;
  case 'insights':  cmdInsights(targetDir); break;
  case 'help': case '--help': case '-h': printHelp(); break;
  default:
    console.log(red(`\n  Unknown command: ${command}`));
    printHelp();
    process.exit(1);
}
