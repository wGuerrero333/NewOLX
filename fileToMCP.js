#!/usr/bin/env node
// ejecutando este file con node se lanza el proceso pensado en opencode
const { readFileSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');

const DEFAULT_REPO = 'wGuerrero333/NewOLX';
// este token lo hice en github el publico esta alla como autorizacion 
// el privado esta en ~/.opencode/mcp.json
function getToken() {
  const configPath = join(homedir(), '.opencode', 'mcp.json');
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    return config.mcpServers.github.env.GITHUB_TOKEN;
  } catch {
    console.error('Error: No se pudo leer el token desde c');
    process.exit(1);
  }
}

function getArgs() {
  const args = process.argv.slice(2);
  let repo = DEFAULT_REPO;
  const idx = args.indexOf('--repo');
  if (idx !== -1 && args[idx + 1]) {
    repo = args[idx + 1];
    args.splice(idx, 2);
  }
  return { command: args[0], params: args.slice(1), repo };
}

async function api(path, options = {}) {
  const token = getToken();
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Error ${res.status}: ${data.message}`);
    process.exit(1);
  }
  return data;
}

async function listIssues(repo) {
  const issues = await api(`/repos/${repo}/issues`);
  const filtered = issues.filter(i => !i.pull_request);
  if (filtered.length === 0) {
    console.log(`\n\x1b[33mNo hay issues abiertos en ${repo}\x1b[0m`);
    return;
  }
  console.log(`\n\x1b[36mIssues abiertos en ${repo}:\x1b[0m`);
  for (const issue of filtered) {
    console.log(`  \x1b[32m#${issue.number}\x1b[0m ${issue.title} (\x1b[33m${issue.state}\x1b[0m)`);
  }
}

async function createIssue(repo, title, body) {
  const issue = await api(`/repos/${repo}/issues`, {
    method: 'POST',
    body: JSON.stringify({ title, body: body || '' }),
  });
  console.log(`\n\x1b[32m✅ Issue #${issue.number} creado:\x1b[0m ${issue.title}`);
  console.log(`   \x1b[36m${issue.html_url}\x1b[0m`);
}

async function listPRs(repo) {
  const prs = await api(`/repos/${repo}/pulls`);
  if (prs.length === 0) {
    console.log(`\n\x1b[33mNo hay PRs abiertos en ${repo}\x1b[0m`);
    return;
  }
  console.log(`\n\x1b[36mPRs abiertos en ${repo}:\x1b[0m`);
  for (const pr of prs) {
    console.log(`  \x1b[32m#${pr.number}\x1b[0m ${pr.title} (\x1b[33m${pr.head.ref} → ${pr.base.ref}\x1b[0m)`);
  }
}

async function createPR(repo, title, base, head, body) {
  const pr = await api(`/repos/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, body: body || '', base, head }),
  });
  console.log(`\n\x1b[32m✅ PR #${pr.number} creado:\x1b[0m ${pr.title}`);
  console.log(`   ${pr.head.ref} → ${pr.base.ref}`);
  console.log(`   \x1b[36m${pr.html_url}\x1b[0m`);
}

function showHelp() {
  console.log(`
\x1b[1mMCP GitHub Automation — fileToMCP.js\x1b[0m

Uso:
  \x1b[36mnode fileToMCP.js issues\x1b[0m                    Listar issues abiertos
  \x1b[36mnode fileToMCP.js issue <title> [body]\x1b[0m      Crear un issue
  \x1b[36mnode fileToMCP.js prs\x1b[0m                       Listar PRs abiertos
  \x1b[36mnode fileToMCP.js pr <title> <base> <head>\x1b[0m  Crear un PR
  \x1b[36mnode fileToMCP.js --repo <owner/repo>\x1b[0m       Especificar repositorio

Ejemplos:
  node fileToMCP.js issues
  node fileToMCP.js issue "Bug fix" "Descripción del bug"
  node fileToMCP.js issue "Nueva feature" --repo wGuerrero333/expressServerNode
  node fileToMCP.js pr "Fix login" main fix-login-branch
  node fileToMCP.js prs
`);
}

async function main() {
  const { command, params, repo } = getArgs();

  switch (command) {
    case 'issues':
      await listIssues(repo);
      break;
    case 'issue':
      if (!params[0]) {
        console.error('Error: Debes proporcionar un título para el issue');
        showHelp();
        process.exit(1);
      }
      await createIssue(repo, params[0], params.slice(1).join(' '));
      break;
    case 'prs':
      await listPRs(repo);
      break;
    case 'pr':
      if (!params[0] || !params[1] || !params[2]) {
        console.error('Error: Uso: fileToMCP.js pr <title> <base> <head>');
        showHelp();
        process.exit(1);
      }
      await createPR(repo, params[0], params[1], params[2], params.slice(3).join(' '));
      break;
    default:
      showHelp();
  }
}

main();
