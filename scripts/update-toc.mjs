#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(repoRoot, 'components');
const componentsReadme = path.join(componentsDir, 'README.md');

async function getComponentStructure() {
  const entries = await fs.readdir(componentsDir, { withFileTypes: true });
  const categories = {};
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const categoryPath = path.join(componentsDir, entry.name);
    const categoryEntries = await fs.readdir(categoryPath, { withFileTypes: true });
    
    const components = [];
    for (const componentEntry of categoryEntries) {
      if (!componentEntry.isDirectory()) continue;
      
      try {
        await fs.access(path.join(categoryPath, componentEntry.name, 'README.md'));
        components.push(componentEntry.name);
      } catch {
        // Skip if no README.md
      }
    }
    
    if (components.length > 0) {
      categories[entry.name] = components.sort((a, b) => a.localeCompare(b));
    }
  }
  
  return categories;
}

function generateReadme(categories) {
  let tocContent = '';
  
  for (const [category, components] of Object.entries(categories)) {
    const categoryName = category === 'UI' ? 'UI Components' : 
                        category === 'data-display' ? 'Data Display Components' :
                        category === 'feedback' ? 'Feedback Components' :
                        category === 'navigation' ? 'Navigation Components' :
                        category;
    
    tocContent += `- **${categoryName}**\n`;
    
    for (const component of components) {
      tocContent += `  - [${component}](./${category}/${component}/README.md)\n`;
    }
    tocContent += '\n';
  }
  
  return `# Components Store

This directory contains reusable components organized by folders. Use the links below to navigate to each component's documentation.

## Table of Contents

${tocContent}---

## Component Categories

### UI Components
General purpose components that don't fit neatly into other categories. These include basic form elements and input controls.

### Data Display Components
Components for presenting data to the user, such as tables, lists, and navigation controls.

### Feedback Components
Components that provide feedback to the user, including buttons, modals, progress indicators, and tooltips.

### Navigation Components
Components that aid in navigation within the application, such as navigation bars and sidebars.

---

To update this table of contents automatically, run:

\`\`\`bash
npm run update:toc
\`\`\`

To AI-organize components and update the table of contents (requires \`GOOGLE_API_KEY\`):

\`\`\`bash
npm run organize:components
\`\`\`
`;
}

async function main() {
  const categories = await getComponentStructure();
  const content = generateReadme(categories);
  await fs.writeFile(componentsReadme, content, 'utf8');
  
  const totalComponents = Object.values(categories).reduce((sum, components) => sum + components.length, 0);
  console.log(`Updated ${path.relative(repoRoot, componentsReadme)} with ${totalComponents} components in ${Object.keys(categories).length} categories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});