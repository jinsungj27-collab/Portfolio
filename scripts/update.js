const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const FILES_DIR = path.join(ROOT, 'files');
const DATA_DIR = path.join(ROOT, 'data');

function readOverrides() {
  const file = path.join(DATA_DIR, 'overrides.json');
  if (!fs.existsSync(file)) return { projects: {}, files: {} };
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function firstLineOfReadme(dir) {
  const readme = path.join(dir, 'README.md');
  if (!fs.existsSync(readme)) return '';
  const line = fs.readFileSync(readme, 'utf8').split('\n').find((l) => l.trim());
  return line ? line.replace(/^#\s*/, '').trim() : '';
}

function scanProjects(overrides) {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => {
      const name = d.name;
      const rel = `projects/${name}/`;
      const override = overrides.projects[name] || {};
      return {
        name: override.name || name,
        description: override.description || firstLineOfReadme(path.join(PROJECTS_DIR, name)),
        path: override.path || rel,
        external: override.external || false,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function scanFiles(dir, base = 'files', overrides, results = []) {
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;

    const full = path.join(dir, entry.name);
    const rel = `${base}/${entry.name}`.replace(/\\/g, '/');

    if (entry.isDirectory()) {
      scanFiles(full, rel, overrides, results);
    } else {
      const key = rel.replace(/^files\//, '');
      const override = overrides.files[key] || overrides.files[rel] || {};
      results.push({
        name: override.name || entry.name,
        note: override.note || '',
        path: rel,
      });
    }
  }

  return results.sort((a, b) => a.path.localeCompare(b.path));
}

function writeJson(filename, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2) + '\n');
}

const overrides = readOverrides();
const projects = scanProjects(overrides);
const files = scanFiles(FILES_DIR, 'files', overrides);

writeJson('projects.json', projects);
writeJson('files.json', files);

console.log(`Updated: ${projects.length} project(s), ${files.length} file(s).`);
