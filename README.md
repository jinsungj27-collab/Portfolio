# Portfolio

A plain, minimal portfolio for your code projects and reference files.

## Structure

```
portfolio/
  projects/     ← project folders (each with code + optional README)
  files/        ← snippets, configs, templates you may need later
  data/         ← auto-generated listings (run npm run update)
  index.html    ← the site
```

## Add content

1. **Projects** — create a folder under `projects/` and put your code there. Add a `README.md` for a one-line description.
2. **Files** — drop any file under `files/` (subfolders are fine).
3. Run `.\scripts\update.ps1` (or `npm run update` if Node is installed) to refresh the site listings.
4. Optional: edit `data/overrides.json` to rename items or add notes.

## View locally

```bash
npm run serve
```

Open http://localhost:3000

## Deploy

Upload the whole folder to any static host (GitHub Pages, Netlify, etc.). Run `npm run update` before deploying so listings stay current.
