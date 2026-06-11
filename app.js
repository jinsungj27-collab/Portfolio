async function loadManifest(path) {
  const res = await fetch(path);
  if (!res.ok) return [];
  return res.json();
}

function renderProjects(projects, container) {
  if (!projects.length) {
    container.innerHTML = '<p class="empty">No projects yet. Add a folder under <code>projects/</code>.</p>';
    return;
  }

  container.innerHTML = projects
    .map(
      (p) => `
      <a class="item" href="${p.path}" ${p.external ? 'target="_blank" rel="noopener"' : ''}>
        <div class="item-title">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="item-desc">${escapeHtml(p.description)}</div>` : ''}
        <div class="item-meta">${escapeHtml(p.path)}</div>
      </a>`
    )
    .join('');
}

function renderFiles(files, container) {
  if (!files.length) {
    container.innerHTML = '<p class="empty">No files yet. Add files under <code>files/</code>.</p>';
    return;
  }

  container.innerHTML = files
    .map(
      (f) => `
      <a class="item" href="${f.path}" download>
        <div class="item-title">${escapeHtml(f.name)}</div>
        ${f.note ? `<div class="item-desc">${escapeHtml(f.note)}</div>` : ''}
        <div class="item-meta">${escapeHtml(f.path)}</div>
      </a>`
    )
    .join('');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function init() {
  const [projects, files] = await Promise.all([
    loadManifest('data/projects.json'),
    loadManifest('data/files.json'),
  ]);

  renderProjects(projects, document.getElementById('projects-list'));
  renderFiles(files, document.getElementById('files-list'));
}

init();
