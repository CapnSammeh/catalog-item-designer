import { useState } from 'react'
import { useStore } from '../store'
import McpModal from './McpModal'

export default function Header({ onHelp }) {
  const { item, updateItem, previewMode, togglePreview, showNotes, toggleShowNotes, exportJSON, importJSON } = useStore()
  const [showMcp, setShowMcp] = useState(false)

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const err = importJSON(ev.target.result)
      if (err) alert(`Import failed: ${err}`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <header className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <span className="text-sm font-semibold text-gray-400 tracking-wide uppercase shrink-0">
          Catalog Designer
        </span>
        <button
          onClick={onHelp}
          className="shrink-0 w-6 h-6 rounded-full border border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 text-xs font-semibold flex items-center justify-center transition-colors"
          aria-label="Help"
        >
          ?
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <input
          className="flex-1 text-sm font-medium text-gray-800 bg-transparent border-none outline-none min-w-0 placeholder-gray-400"
          value={item.name}
          onChange={(e) => updateItem({ name: e.target.value })}
          placeholder="Catalog item name…"
        />

        {/* hidden file input for import */}
        <input
          id="import-file"
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />

        <button
          onClick={() => document.getElementById('import-file').click()}
          className="shrink-0 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Import
        </button>
        <button
          onClick={exportJSON}
          className="shrink-0 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Export
        </button>

        <div className="w-px h-5 bg-gray-200" />

        <button
          onClick={() => setShowMcp(true)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Use with Claude
        </button>

        <div className="w-px h-5 bg-gray-200" />

        <button
          onClick={toggleShowNotes}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            showNotes
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-70" />
          {showNotes ? 'Notes on' : 'Notes off'}
        </button>
        <button
          onClick={togglePreview}
          className={`shrink-0 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            previewMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {previewMode ? 'Exit Preview' : 'Preview'}
        </button>
      </header>

      {showMcp && <McpModal onClose={() => setShowMcp(false)} />}
    </>
  )
}
