#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(repoRoot, 'components');
const componentsReadme = path.join(componentsDir, 'README.md');

async function getComponentFolders() {
  const entries = await fs.readdir(componentsDir, { withFileTypes: true });
  const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const filtered = await Promise.all(
    dirNames.map(async (name) => {
      try {
        await fs.access(path.join(componentsDir, name, 'README.md'));
        return name;
      } catch {
        return null;
      }
    })
  );
  return filtered.filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function generateReadme(folders) {
  const items = folders
    .map((name) => `  - [${name}](./${name}/README.md)`) // two-space indent for nested list
    .join('\n');

  return `# Components Store

This directory contains reusable components organized by folders. Use the links below to navigate to each component's documentation.

## Table of Contents

- UI Components
${items}

---

To update this table of contents automatically, run:

\`\`\`bash
npm run update:toc
\`\`\`

To AI-organize components and update the table of contents (requires \`OPENAI_API_KEY\`):

\`\`\`bash
npm run organize:components
\`\`\`
`;
}

async function main() {
  const folders = await getComponentFolders();
  const content = generateReadme(folders);
  await fs.writeFile(componentsReadme, content, 'utf8');
  console.log(`Updated ${path.relative(repoRoot, componentsReadme)} with ${folders.length} items.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});