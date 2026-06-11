function Footer() {
  return (
    <footer className="mt-12 pt-6 border-t border-border text-xs text-muted">
      <p>
        Drop files into <code className="bg-surface px-1 py-0.5 border border-border rounded text-[0.85em] font-mono">projects/</code>{' '}
        or <code className="bg-surface px-1 py-0.5 border border-border rounded text-[0.85em] font-mono">files/</code>, then run{' '}
        <code className="bg-surface px-1 py-0.5 border border-border rounded text-[0.85em] font-mono">npm run update</code>.
      </p>
    </footer>
  )
}

export default Footer
