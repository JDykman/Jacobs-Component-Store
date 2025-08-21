#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';
import yaml from 'js-yaml';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  return `You are an expert frontend architect. Given the components folder structure and docs, propose an improved organization (groupings like UI, data-display, feedback, navigation), and suggest safe renames/moves. 

Output a concise YAML with keys:
- moves: list of {from, to} for safe component relocations
- notes: detailed, actionable insights about the organization, including:
  * Architectural recommendations
  * Naming convention suggestions
  * Potential improvements for maintainability
  * Grouping rationale
  * Future considerations
- toc_sections: map of section -> sorted list of component folder names

Only include safe, mechanical moves (no content edits). Provide comprehensive notes that explain your organizational decisions and provide actionable insights for developers.

Current structure:
${structure.map((e) => `- ${e.type}: ${e.path}`).join('\n')}

Component docs excerpts:
${Object.entries(docs).map(([k, v]) => `### ${k}\n${v}`).join('\n\n')}`;
}

async function callGemini(prompt) {
  const apiKey = ensureEnv('GOOGLE_API_KEY');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          { text: 'You output only valid YAML. No prose, no markdown formatting, no code blocks.' },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
    },
  });
  const content = result.response?.text?.() || '';
  
  // Clean up the response to extract just YAML content
  let cleanedContent = content.trim();
  
  // Remove markdown code block markers if present
  if (cleanedContent.startsWith('```yaml')) {
    cleanedContent = cleanedContent.replace(/^```yaml\s*/, '');
  }
  if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.replace(/^```\s*/, '');
  }
  if (cleanedContent.endsWith('```')) {
    cleanedContent = cleanedContent.replace(/\s*```$/, '');
  }
  
  return cleanedContent;
}

function parseYaml(yamlText) {
  try {
    return yaml.load(yamlText) || {};
  } catch (e) {
    console.error('Failed to parse YAML from AI:', e.message);
    console.error('Raw YAML content received:');
    console.error('---');
    console.error(yamlText);
    console.error('---');
    process.exit(1);
  }
}

async function applyMoves(moves) {
  if (!Array.isArray(moves)) return [];
  
  const appliedMoves = [];
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
      appliedMoves.push({ from, to, status: 'success' });
    } catch (e) {
      console.warn(`Skipping move ${from} -> ${to}:`, e.message);
      appliedMoves.push({ from, to, status: 'failed', error: e.message });
    }
  }
  return appliedMoves;
}

async function generateChangeSummary(appliedMoves, tocSections, aiNotes) {
  const timestamp = new Date().toISOString();
  const summary = {
    timestamp,
    changes: {
      moves: appliedMoves,
      toc_sections: tocSections,
      notes: aiNotes || []
    }
  };

  // Write detailed JSON summary
  const summaryPath = path.join(repoRoot, 'ai-changes-summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  // Generate human-readable markdown summary
  const markdownLines = [
    '# AI Component Organization Summary',
    '',
    `**Generated:** ${new Date(timestamp).toLocaleString()}`,
    '',
    '## Changes Made',
    ''
  ];

  if (appliedMoves.length > 0) {
    markdownLines.push('### Component Moves');
    for (const move of appliedMoves) {
      const status = move.status === 'success' ? '✅' : '❌';
      markdownLines.push(`${status} \`${move.from}\` → \`${move.to}\``);
      if (move.error) {
        markdownLines.push(`   - Error: ${move.error}`);
      }
    }
    markdownLines.push('');
  }

  if (tocSections && Object.keys(tocSections).length > 0) {
    markdownLines.push('### New Table of Contents Structure');
    for (const [section, components] of Object.entries(tocSections)) {
      markdownLines.push(`- **${section}**`);
      for (const component of components) {
        markdownLines.push(`  - ${component}`);
      }
    }
    markdownLines.push('');
  }

  if (aiNotes && aiNotes.length > 0) {
    markdownLines.push('### AI Notes');
    for (const note of aiNotes) {
      markdownLines.push(`- ${note}`);
    }
    markdownLines.push('');
  }

  markdownLines.push('---', '', 'This summary was automatically generated by the AI component organization workflow.');

  const markdownPath = path.join(repoRoot, 'AI_CHANGES_SUMMARY.md');
  await fs.writeFile(markdownPath, markdownLines.join('\n'), 'utf8');

  return { summaryPath, markdownPath };
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

  lines.push('', '---', '', 'To update this table of contents automatically, run:', '', '```bash', 'npm run update:toc', '```', '', 'To AI-organize components and update the table of contents (requires `GOOGLE_API_KEY`):', '', '```bash', 'npm run organize:components', '```', '');

  await fs.writeFile(path.join(componentsDir, 'README.md'), lines.join('\n'), 'utf8');
}

async function main() {
  const structure = await listStructure(componentsDir);
  const docs = await readComponentDocs();
  const prompt = buildPrompt(structure, docs);
  const yamlText = await callGemini(prompt);
  const { moves = [], toc_sections: tocSections = {}, notes: aiNotes = [] } = parseYaml(yamlText);
  
  const appliedMoves = await applyMoves(moves);
  await writeComponentsReadme(tocSections);
  
  const { summaryPath, markdownPath } = await generateChangeSummary(appliedMoves, tocSections, aiNotes);
  
  console.log('Organization complete.');
  console.log(`Change summary saved to: ${summaryPath}`);
  console.log(`Markdown summary saved to: ${markdownPath}`);
  
  // Output summary for GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    const githubOutput = process.env.GITHUB_OUTPUT;
    if (githubOutput) {
      const fs = await import('fs');
      const output = [
        `changes_made=${appliedMoves.length > 0 ? 'true' : 'false'}`
      ].join('\n');
      fs.writeFileSync(githubOutput, output, 'utf8');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});