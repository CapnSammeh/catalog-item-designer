import { useState } from 'react'
import { Upload, Download, HelpCircle, Bug, Eye, EyeOff, Layers } from 'lucide-react'
import { useStore } from '../store'
import McpModal from './McpModal'

const ISSUES_URL = 'https://github.com/CapnSammeh/catalog-item-designer/issues/new/choose'

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
      <header className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        {/* Brand */}
        <span className="text-sm font-semibold text-gray-400 tracking-wide uppercase shrink-0">
          Catalog Designer
        </span>
        <button
          onClick={onHelp}
          className="shrink-0 text-gray-400 hover:text-blue-500 transition-colors"
          aria-label="Help"
          title="Help"
        >
          <HelpCircle size={16} />
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Item name */}
        <input
          className="flex-1 text-sm font-medium text-gray-800 bg-transparent border-none outline-none min-w-0 placeholder-gray-400"
          value={item.name}
          onChange={(e) => updateItem({ name: e.target.value })}
          placeholder="Catalog item name…"
        />

        {/* hidden file input */}
        <input
          id="import-file"
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />

        {/* Import / Export */}
        <button
          onClick={() => document.getElementById('import-file').click()}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Import design from JSON"
        >
          <Upload size={13} /> Import
        </button>
        <button
          onClick={exportJSON}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Export design as JSON"
        >
          <Download size={13} /> Export
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Use with Claude */}
        <button
          onClick={() => setShowMcp(true)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
          title="Connect Claude AI via MCP"
        >
          <Layers size={13} />
          Use with Claude
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Notes toggle */}
        <button
          onClick={toggleShowNotes}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            showNotes
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={showNotes ? 'Hide notes' : 'Show notes'}
        >
          <span className="w-2 h-2 rounded-full bg-current opacity-70" />
          {showNotes ? 'Notes on' : 'Notes off'}
        </button>

        {/* Preview */}
        <button
          onClick={togglePreview}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            previewMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {previewMode ? <><EyeOff size={13} /> Exit Preview</> : <><Eye size={13} /> Preview</>}
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Report a bug */}
        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Submit a bug or feature request"
        >
          <Bug size={13} /> Feedback
        </a>
      </header>

      {showMcp && <McpModal onClose={() => setShowMcp(false)} />}
    </>
  )
}
