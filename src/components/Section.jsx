import ListItem from './ListItem'

function Section({ title, note, items, emptyText, itemProps }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
        {title}
      </h2>
      {note && <p className="text-muted text-sm -mt-2 mb-4">{note}</p>}
      <div className="flex flex-col">
        {items.length === 0 ? (
          <p className="text-muted text-sm py-4">{emptyText}</p>
        ) : (
          items.map(item => (
            <ListItem key={item.path || item.name} {...itemProps(item)} />
          ))
        )}
      </div>
    </section>
  )
}

export default Section
