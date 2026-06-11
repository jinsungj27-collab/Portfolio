import { useState, useEffect } from 'react'
import Header from './components/Header'
import Section from './components/Section'
import Footer from './components/Footer'

function useFetchJson(url) {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch(url)
      .then(res => (res.ok ? res.json() : []))
      .catch(() => [])
      .then(setData)
  }, [url])
  return data
}

function App() {
  const projects = useFetchJson('./data/projects.json')
  const files = useFetchJson('./data/files.json')

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 font-sans text-[15px] leading-relaxed text-gray-900 bg-[#fafafa] min-h-screen">
      <Header />
      <main>
        <Section
          title="Projects"
          items={projects}
          emptyText="No projects yet."
          itemProps={p => ({
            title: p.name,
            meta: p.path,
            description: p.description,
            href: p.url || p.path,
            external: !!p.url,
          })}
        />
        <Section
          title="Files"
          note="Reference files, configs, and snippets you may need someday."
          items={files}
          emptyText="No files yet."
          itemProps={f => ({
            title: f.name,
            meta: f.path,
            description: f.description,
            href: f.path,
            download: true,
          })}
        />
      </main>
      <Footer />
    </div>
  )
}

export default App
