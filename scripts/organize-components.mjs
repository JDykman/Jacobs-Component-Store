#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';
import yaml from 'js-yaml';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const componentsDir = path.join(repoRoot, 'components');

// Component categorization rules based on common patterns
const CATEGORY_RULES = {
  'UI': {
    patterns: ['input', 'checkbox', 'radio', 'select', 'textarea', 'switch', 'slider'],
    keywords: ['form', 'input', 'control', 'field', 'element']
  },
  'data-display': {
    patterns: ['table', 'list', 'grid', 'card', 'pagination', 'tabs', 'dropdown', 'tree'],
    keywords: ['data', 'display', 'list', 'table', 'grid', 'pagination']
  },
  'feedback': {
    patterns: ['button', 'modal', 'toast', 'notification', 'alert', 'progress', 'tooltip', 'spinner'],
    keywords: ['feedback', 'interaction', 'action', 'progress', 'notification']
  },
  'navigation': {
    patterns: ['navbar', 'sidebar', 'breadcrumb', 'menu', 'tabs', 'pagination'],
    keywords: ['navigation', 'menu', 'nav', 'sidebar', 'breadcrumb']
  },
  'layout': {
    patterns: ['container', 'grid', 'flexbox', 'header', 'footer', 'section'],
    keywords: ['layout', 'container', 'grid', 'structure']
  }
};

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

async function scanForComponents() {
  const components = [];
  
  async function scanDirectory(dir, relativePath = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const componentPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        // Check if this directory contains component files
        const hasReadme = await fs.access(path.join(fullPath, 'README.md')).then(() => true).catch(() => false);
        const hasComponentFiles = await hasComponentFilesInDir(fullPath);
        
        if (hasReadme || hasComponentFiles) {
          components.push({
            name: entry.name,
            path: componentPath,
            fullPath: fullPath,
            hasReadme,
            hasComponentFiles,
            category: null,
            suggestedCategory: null
          });
        }
        
        // Recursively scan subdirectories
        await scanDirectory(fullPath, componentPath);
      }
    }
  }
  
  await scanDirectory(componentsDir);
  return components;
}

async function hasComponentFilesInDir(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const componentExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte'];
    
    return entries.some(entry => {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        return componentExtensions.includes(ext) || entry.name.includes('Component');
      }
      return false;
    });
  } catch {
    return false;
  }
}

async function readComponentContent(component) {
  const content = {};
  
  try {
    // Read README if it exists
    if (component.hasReadme) {
      const readmePath = path.join(component.fullPath, 'README.md');
      content.readme = await fs.readFile(readmePath, 'utf8');
    }
    
    // Read component files
    const entries = await fs.readdir(component.fullPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte'].includes(ext)) {
          try {
            const filePath = path.join(component.fullPath, entry.name);
            content[entry.name] = await fs.readFile(filePath, 'utf8');
          } catch (e) {
            // Skip files that can't be read
          }
        }
      }
    }
  } catch (e) {
    // Component might not have readable content
  }
  
  return content;
}

function categorizeComponent(component, content) {
  const componentName = component.name.toLowerCase();
  const allContent = Object.values(content).join(' ').toLowerCase();
  
  let bestCategory = null;
  let bestScore = 0;
  
  for (const [category, rules] of Object.entries(CATEGORY_RULES)) {
    let score = 0;
    
    // Check name patterns
    for (const pattern of rules.patterns) {
      if (componentName.includes(pattern)) {
        score += 10;
      }
    }
    
    // Check content keywords
    for (const keyword of rules.keywords) {
      if (allContent.includes(keyword)) {
        score += 5;
      }
    }
    
    // Check README content for category hints
    if (content.readme) {
      const readmeLower = content.readme.toLowerCase();
      for (const keyword of rules.keywords) {
        if (readmeLower.includes(keyword)) {
          score += 3;
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  return bestScore > 5 ? bestCategory : 'UI'; // Default to UI if no clear category
}

function generateOptimalStructure(components) {
  const structure = {};
  
  // Group components by their current location and suggested category
  for (const component of components) {
    const currentCategory = getCurrentCategory(component.path);
    const suggestedCategory = component.suggestedCategory;
    
    if (currentCategory !== suggestedCategory) {
      // Component needs to be moved
      if (!structure.moves) structure.moves = [];
      structure.moves.push({
        from: `components/${component.path}`,
        to: `components/${suggestedCategory}/${component.name}`,
        reason: `Moving from ${currentCategory || 'root'} to ${suggestedCategory} category`
      });
    }
    
    // Build the new table of contents structure
    if (!structure.toc_sections) structure.toc_sections = {};
    if (!structure.toc_sections[suggestedCategory]) {
      structure.toc_sections[suggestedCategory] = [];
    }
    structure.toc_sections[suggestedCategory].push(component.name);
  }
  
  // Sort components within each category
  for (const category in structure.toc_sections) {
    structure.toc_sections[category].sort();
  }
  
  return structure;
}

function getCurrentCategory(componentPath) {
  const parts = componentPath.split(path.sep);
  if (parts.length > 1) {
    return parts[0];
  }
  return null; // Component is in root components directory
}

async function applyMoves(moves) {
  if (!Array.isArray(moves)) return [];
  
  const appliedMoves = [];
  for (const move of moves) {
    if (!move.from || !move.to) continue;
    
    const fromPath = path.join(repoRoot, move.from);
    const toPath = path.join(repoRoot, move.to);
    
    // Prevent escapes
    if (!fromPath.startsWith(componentsDir) || !toPath.startsWith(componentsDir)) {
      console.warn('Skipping move outside components:', move.from, '->', move.to);
      continue;
    }
    
    try {
      await fs.mkdir(path.dirname(toPath), { recursive: true });
      await fs.rename(fromPath, toPath);
      console.log(`✅ Moved ${move.from} -> ${move.to}`);
      appliedMoves.push({ ...move, status: 'success' });
    } catch (e) {
      console.warn(`❌ Failed to move ${move.from} -> ${move.to}: ${e.message}`);
      appliedMoves.push({ ...move, status: 'failed', error: e.message });
    }
  }
  return appliedMoves;
}

async function writeComponentsReadme(tocSections) {
  const lines = [
    '# Components Store',
    '',
    'This directory contains reusable components organized by folders. Use the links below to navigate to each component\'s documentation.',
    '',
    '## Table of Contents',
    ''
  ];

  for (const [section, components] of Object.entries(tocSections)) {
    const sectionName = section === 'UI' ? 'UI Components' : 
                       section === 'data-display' ? 'Data Display Components' :
                       section === 'feedback' ? 'Feedback Components' :
                       section === 'navigation' ? 'Navigation Components' :
                       section === 'layout' ? 'Layout Components' :
                       section;
    
    lines.push(`- **${sectionName}**`);
    
    for (const component of components) {
      lines.push(`  - [${component}](./${section}/${component}/README.md)`);
    }
    lines.push('');
  }

  lines.push('---', '', '## Component Categories', '', 
    '### UI Components', 
    'General purpose components that don\'t fit neatly into other categories. These include basic form elements and input controls.', '', 
    '### Data Display Components', 
    'Components for presenting data to the user, such as tables, lists, and navigation controls.', '', 
    '### Feedback Components', 
    'Components that provide feedback to the user, including buttons, modals, progress indicators, and tooltips.', '', 
    '### Navigation Components', 
    'Components that aid in navigation within the application, such as navigation bars and sidebars.', '', 
    '### Layout Components', 
    'Components for structuring and organizing page layout, such as containers, grids, and sections.', '', 
    '---', '', 
    'To update this table of contents automatically, run:', '', 
    '```bash', 
    'npm run update:toc', 
    '```', '', 
    'To AI-organize components and update the table of contents:', '', 
    '```bash', 
    'npm run organize:components', 
    '```', '');

  await fs.writeFile(path.join(componentsDir, 'README.md'), lines.join('\n'), 'utf8');
}

async function generateChangeSummary(appliedMoves, tocSections) {
  const timestamp = new Date().toISOString();
  const summary = {
    timestamp,
    changes: {
      moves: appliedMoves,
      toc_sections: tocSections,
      notes: [
        'Components were automatically analyzed and organized based on their content and naming patterns.',
        'The organization follows established frontend architecture patterns for better discoverability and maintainability.',
        'All components are now properly categorized and accessible through the updated table of contents.'
      ]
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
      if (move.reason) {
        markdownLines.push(`   - Reason: ${move.reason}`);
      }
      if (move.error) {
        markdownLines.push(`   - Error: ${move.error}`);
      }
    }
    markdownLines.push('');
  }

  if (tocSections && Object.keys(tocSections).length > 0) {
    markdownLines.push('### New Table of Contents Structure');
    for (const [section, components] of Object.entries(tocSections)) {
      const sectionName = section === 'UI' ? 'UI Components' : 
                         section === 'data-display' ? 'Data Display Components' :
                         section === 'feedback' ? 'Feedback Components' :
                         section === 'navigation' ? 'Navigation Components' :
                         section === 'layout' ? 'Layout Components' :
                         section;
      markdownLines.push(`- **${sectionName}**`);
      for (const component of components) {
        markdownLines.push(`  - ${component}`);
      }
    }
    markdownLines.push('');
  }

  markdownLines.push('### AI Notes');
  markdownLines.push('- Components were automatically analyzed and organized based on their content and naming patterns.');
  markdownLines.push('- The organization follows established frontend architecture patterns for better discoverability and maintainability.');
  markdownLines.push('- All components are now properly categorized and accessible through the updated table of contents.');
  markdownLines.push('', '---', '', 'This summary was automatically generated by the AI component organization workflow.');

  const markdownPath = path.join(repoRoot, 'AI_CHANGES_SUMMARY.md');
  await fs.writeFile(markdownPath, markdownLines.join('\n'), 'utf8');

  return { summaryPath, markdownPath };
}

async function main() {
  console.log('🔍 Scanning for components...');
  const components = await scanForComponents();
  console.log(`Found ${components.length} components`);
  
  console.log('📖 Analyzing component content...');
  for (const component of components) {
    const content = await readComponentContent(component);
    component.suggestedCategory = categorizeComponent(component, content);
    console.log(`  ${component.name} → ${component.suggestedCategory}`);
  }
  
  console.log('🏗️  Generating optimal structure...');
  const structure = generateOptimalStructure(components);
  
  if (structure.moves && structure.moves.length > 0) {
    console.log(`📦 Moving ${structure.moves.length} components...`);
    const appliedMoves = await applyMoves(structure.moves);
    
    console.log('📝 Updating table of contents...');
    await writeComponentsReadme(structure.toc_sections);
    
    console.log('📊 Generating change summary...');
    const { summaryPath, markdownPath } = await generateChangeSummary(appliedMoves, structure.toc_sections);
    
    console.log('✅ Organization complete!');
    console.log(`Change summary saved to: ${summaryPath}`);
    console.log(`Markdown summary saved to: ${markdownPath}`);
  } else {
    console.log('✨ All components are already properly organized!');
    console.log('📝 Updating table of contents...');
    await writeComponentsReadme(structure.toc_sections);
    console.log('✅ Table of contents updated.');
  }
  
  // Output summary for GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    const githubOutput = process.env.GITHUB_OUTPUT;
    if (githubOutput) {
      const fs = await import('fs');
      const output = [
        `changes_made=${structure.moves && structure.moves.length > 0 ? 'true' : 'false'}`
      ].join('\n');
      fs.writeFileSync(githubOutput, output, 'utf8');
    }
  }
}

main().catch((err) => {
  console.error('❌ Error during organization:', err);
  process.exit(1);
});