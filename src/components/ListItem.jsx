function ListItem({ title, meta, description, href, download, external }) {
  const linkProps = {
    href,
    ...(download && { download: '' }),
    ...(external && { target: '_blank', rel: 'noopener noreferrer' }),
  }

  return (
    <a
      className="block py-3 border-b border-border first:border-t first:border-border no-underline text-inherit transition-colors hover:text-gray-800"
      {...linkProps}
    >
      <div className="font-medium">{title}</div>
      {meta && <div className="text-xs text-muted font-mono">{meta}</div>}
      {description && <div className="text-sm text-muted mt-0.5">{description}</div>}
    </a>
  )
}

export default ListItem
