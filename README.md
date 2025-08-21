# Jacobs-Component-Store
A collection of components from previous projects.

## Components Store

The reusable components live in `components/`. The file `components/README.md` contains a navigable table of contents.

### Local maintenance

- Update the TOC after adding/removing components:

```bash
npm run update:toc
```

- Let AI propose an organization (requires `OPENAI_API_KEY`):

```bash
npm run organize:components
```

### GitHub Action

A manual workflow is available: `Organize Components`.

- It updates the TOC, calls AI to propose safe moves, applies them, updates the TOC again, and commits any changes.
- Configure the `OPENAI_API_KEY` repository secret for it to work fully.
