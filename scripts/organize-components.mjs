#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';
import yaml from 'js-yaml';
import { OpenAI } from 'openai';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(repoRoot, 'components');

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

async function listStructure(dir, base = 'components') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);
    if (entry.isDirectory()) {
      result.push({ type: 'dir', path: relPath });
      const nested = await listStructure(fullPath, relPath);
      result.push(...nested);
    } else {
      result.push({ type: 'file', path: relPath });
    }
  }
  return result;
}

async function readComponentDocs() {
  const entries = await fs.readdir(componentsDir, { withFileTypes: true });
  const docs = {};
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const readmePath = path.join(componentsDir, entry.name, 'README.md');
    try {
      const content = await fs.readFile(readmePath, 'utf8');
      docs[entry.name] = content.slice(0, 4000); // limit token usage
    } catch {}
  }
  return docs;
}

function buildPrompt(structure, docs) {
  return `You are an expert frontend architect. Given the components folder structure and docs, propose an improved organization (groupings like UI, data-display, feedback, navigation), and suggest safe renames/moves. Output a concise YAML with keys: moves (list of {from, to}), notes (short bullets), and toc_sections (map of section -> sorted list of component folder names). Only include safe, mechanical moves (no content edits).\n\nCurrent structure:\n${structure.map((e) => `- ${e.type}: ${e.path}`).join('\n')}\n\nComponent docs excerpts:\n${Object.entries(docs).map(([k, v]) => `### ${k}\n${v}`).join('\n\n')}`;
}

async function callOpenAI(prompt) {
  const apiKey = ensureEnv('OPENAI_API_KEY');
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You output only valid YAML. No prose.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
  });
  const content = res.choices?.[0]?.message?.content || '';
  return content.trim();
}

function parseYaml(yamlText) {
  try {
    return yaml.load(yamlText) || {};
  } catch (e) {
    console.error('Failed to parse YAML from AI:', e.message);
    process.exit(1);
  }
}

async function applyMoves(moves) {
  if (!Array.isArray(moves)) return;
  for (const { from, to } of moves) {
    if (!from || !to) continue;
    const fromPath = path.join(repoRoot, from);
    const toPath = path.join(repoRoot, to);
    // Prevent escapes
    if (!fromPath.startsWith(componentsDir) || !toPath.startsWith(componentsDir)) {
      console.warn('Skipping move outside components:', from, '->', to);
      continue;
    }
    await fs.mkdir(path.dirname(toPath), { recursive: true });
    try {
      await fs.rename(fromPath, toPath);
      console.log(`Moved ${from} -> ${to}`);
    } catch (e) {
      console.warn(`Skipping move ${from} -> ${to}:`, e.message);
    }
  }
}

async function writeComponentsReadme(tocSections) {
  // tocSections: { Section: [ComponentName, ...] }
  const lines = [
    '# Components Store',
    '',
    'This directory contains reusable components organized by folders. Use the links below to navigate to each component\'s documentation.',
    '',
    '## Table of Contents',
    ''
  ];

  const sections = tocSections && typeof tocSections === 'object' ? tocSections : { 'UI Components': await fs.readdir(componentsDir) };

  for (const sectionName of Object.keys(sections)) {
    lines.push(`- ${sectionName}`);
    const items = (sections[sectionName] || []).slice().sort((a, b) => a.localeCompare(b));
    for (const item of items) {
      lines.push(`  - [${item}](./${item}/README.md)`);
    }
  }

  lines.push('', '---', '', 'To update this table of contents automatically, run:', '', '```bash', 'npm run update:toc', '```', '', 'To AI-organize components and update the table of contents (requires `OPENAI_API_KEY`):', '', '```bash', 'npm run organize:components', '```', '');

  await fs.writeFile(path.join(componentsDir, 'README.md'), lines.join('\n'), 'utf8');
}

async function main() {
  const structure = await listStructure(componentsDir);
  const docs = await readComponentDocs();
  const prompt = buildPrompt(structure, docs);
  const yamlText = await callOpenAI(prompt);
  const { moves = [], toc_sections: tocSections = {} } = parseYaml(yamlText);
  await applyMoves(moves);
  await writeComponentsReadme(tocSections);
  console.log('Organization complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});