import { useDraggable } from '@dnd-kit/core'
import { FIELD_TYPES } from '../fieldTypes'
import { useStore } from '../store'

function PaletteItem({ type }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type.key}`,
    data: { source: 'palette', fieldType: type.key },
  })
  const { item, addField } = useStore()

  function handleClick() {
    const firstSection = item.sections[0]
    if (firstSection) addField(firstSection.id, type.key)
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-white cursor-grab active:cursor-grabbing select-none text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <span className="w-6 text-center text-xs text-gray-400 font-mono">{type.icon}</span>
      {type.label}
    </div>
  )
}

export default function Palette() {
  const addSection = useStore((s) => s.addSection)

  return (
    <aside className="w-56 shrink-0 flex flex-col gap-2 p-4 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Fields</p>
      {FIELD_TYPES.map((t) => (
        <PaletteItem key={t.key} type={t} />
      ))}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Layout</p>
        <button
          onClick={addSection}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-gray-300 bg-white text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add Section
        </button>
      </div>
    </aside>
  )
}
