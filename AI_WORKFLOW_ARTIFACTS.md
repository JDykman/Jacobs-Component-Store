# AI Workflow Artifacts

This document explains how the AI component organization workflow generates artifacts to track and display changes.

## What Gets Generated

When the AI workflow runs, it creates two main artifacts:

### 1. `ai-changes-summary.json`
A detailed JSON file containing:
- Timestamp of when changes were made
- List of all component moves (successful and failed)
- New table of contents structure
- AI-generated notes about the reorganization

### 2. `AI_CHANGES_SUMMARY.md`
A human-readable markdown summary showing:
- ✅ Successful component moves
- ❌ Failed moves with error details
- New TOC structure organized by category
- AI reasoning and notes

## How It Works

### In GitHub Actions
1. **Artifacts**: Both files are uploaded as GitHub Actions artifacts named `ai-changes-summary`
2. **Commit Comments**: A summary comment is automatically added to the commit
3. **Smart Commit Messages**: Commit messages change based on whether components were moved

### Locally
- Run `npm run test:summary` to see a mock example
- Run `npm run organize:components` (with `GOOGLE_API_KEY`) for real AI organization

## Example Output

```markdown
# AI Component Organization Summary

**Generated:** 12/19/2024, 2:30:45 PM

## Changes Made

### Component Moves
✅ `components/old-button` → `components/ui/button`
✅ `components/old-card` → `components/ui/card`
❌ `components/broken-component` → `components/ui/broken`
   - Error: Component not found

### New Table of Contents Structure
- **UI Components**
  - button
  - card
  - input
  - modal
- **Data Display**
  - table
  - chart
  - list

### AI Notes
- Grouped common UI components into ui/ subdirectory
- Organized data display components separately
- Created navigation component category
```

## Benefits

- **Transparency**: See exactly what the AI changed
- **Audit Trail**: Track all modifications with timestamps
- **Error Handling**: Identify failed operations
- **Documentation**: Understand AI reasoning and organization logic
- **Artifacts**: Download detailed summaries from GitHub Actions

## Files Modified

- `scripts/organize-components.mjs` - Enhanced with change tracking
- `.github/workflows/organize-components.yml` - Added artifact uploads and commit comments
- `scripts/generate-change-summary.mjs` - New testing script
- `package.json` - Added test script