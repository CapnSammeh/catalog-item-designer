import { useState } from 'react'
import { useStore } from '../store'
import { FIELD_TYPE_MAP } from '../fieldTypes'

function ChoiceOptions({ options = [], onChange }) {
  const add = () => onChange([...options, ''])
  const remove = (i) => onChange(options.filter((_, idx) => idx !== i))
  const update = (i, val) => onChange(options.map((o, idx) => (idx === i ? val : o)))

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">Options</label>
      <div className="flex flex-col gap-1.5">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-1">
            <input
              className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400"
              value={opt}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
            />
            <button
              onClick={() => remove(i)}
              className="text-gray-300 hover:text-red-400 px-1"
              aria-label="Remove option"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="mt-2 text-xs text-blue-500 hover:text-blue-700"
      >
        + Add option
      </button>
    </div>
  )
}

function TypeConfig({ field, sectionId }) {
  const updateField = useStore((s) => s.updateField)
  const tc = field.typeConfig ?? {}
  const set = (patch) => updateField(sectionId, field.id, { typeConfig: { ...tc, ...patch } })

  if (field.type === 'choice') {
    return (
      <ChoiceOptions
        options={tc.options ?? []}
        onChange={(options) => set({ options })}
      />
    )
  }

  if (field.type === 'reference' || field.type === 'multi_reference') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Table name</label>
        <input
          className="w-full text-sm border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400"
          value={tc.table ?? ''}
          onChange={(e) => set({ table: e.target.value })}
          placeholder="e.g. incident"
        />
      </div>
    )
  }

  if (field.type === 'html') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">HTML content</label>
        <textarea
          className="w-full text-sm border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400 font-mono resize-y"
          rows={4}
          value={tc.content ?? ''}
          onChange={(e) => set({ content: e.target.value })}
          placeholder="<p>Display text…</p>"
        />
      </div>
    )
  }

  if (field.type === 'acknowledgement') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Statement text</label>
        <textarea
          className="w-full text-sm border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400 resize-y"
          rows={3}
          value={tc.statementText ?? ''}
          onChange={(e) => set({ statementText: e.target.value })}
          placeholder="I acknowledge that…"
        />
      </div>
    )
  }

  return null
}

export default function ConfigPanel() {
  const { item, selectedFieldId, selectedSectionId, updateField, clearSelection } = useStore()
  const [tab, setTab] = useState('config')

  const section = item.sections.find((s) => s.id === selectedSectionId)
  const field = section?.fields.find((f) => f.id === selectedFieldId)

  if (!field) {
    return (
      <aside className="w-64 shrink-0 p-4 bg-gray-50 border-l border-gray-200 flex items-center justify-center">
        <p className="text-sm text-gray-400 text-center">Select a field to configure it</p>
      </aside>
    )
  }

  const typeMeta = FIELD_TYPE_MAP[field.type]
  const update = (patch) => updateField(selectedSectionId, field.id, patch)

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-gray-50 border-l border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {typeMeta?.label ?? field.type}
        </span>
        <button
          onClick={clearSelection}
          className="text-gray-400 hover:text-gray-600 text-sm"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 shrink-0">
        {['config', 'notes'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
              tab === t
                ? 'text-blue-600 border-b-2 border-blue-500 bg-white'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Config tab */}
      {tab === 'config' && (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
            <input
              className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-blue-400"
              value={field.label}
              onChange={(e) => update({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Help text</label>
            <input
              className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-blue-400"
              value={field.helpText}
              onChange={(e) => update({ helpText: e.target.value })}
              placeholder="Optional hint for the user"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={field.required}
              onChange={(e) => update({ required: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Required</span>
          </label>

          <TypeConfig field={field} sectionId={selectedSectionId} />
        </div>
      )}

      {/* Notes tab */}
      {tab === 'notes' && (
        <div className="flex flex-col flex-1 p-4 overflow-hidden">
          <p className="text-xs text-gray-400 mb-2">
            Notes are for your team — describe logic, business rules, or implementation guidance.
          </p>
          <textarea
            className="flex-1 w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 resize-none bg-white"
            value={field.notes ?? ''}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="e.g. This dropdown should be populated from the CMDB. Only show production instances. Required before scheduling a change window…"
          />
        </div>
      )}
    </aside>
  )
}
