import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FIELD_TYPE_MAP } from '../fieldTypes'
import { useStore } from '../store'

export default function FieldCard({ field, sectionId }) {
  const { selectedFieldId, selectField, deleteField, showNotes } = useStore()
  const isSelected = selectedFieldId === field.id

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id, data: { sectionId } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const typeMeta = FIELD_TYPE_MAP[field.type] ?? { label: field.type, icon: '?' }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectField(field.id, sectionId)}
      className={`group flex items-start gap-2 px-3 py-2.5 rounded-lg border bg-white cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-300'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>

      {/* type badge */}
      <span className="shrink-0 text-xs font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded mt-0.5">
        {typeMeta.icon}
      </span>

      {/* content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${field.label ? 'text-gray-800' : 'text-gray-400 italic'}`}>
          {field.label || 'Untitled field'}
        </p>
        {field.helpText && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{field.helpText}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{typeMeta.label}{field.required ? ' · required' : ''}</p>
        {showNotes && field.notes && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1.5 whitespace-pre-wrap">
            {field.notes}
          </p>
        )}
      </div>

      {/* notes indicator */}
      {field.notes && (
        <span
          className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-400"
          title="Has notes"
        />
      )}

      {/* delete */}
      <button
        onClick={(e) => { e.stopPropagation(); deleteField(sectionId, field.id) }}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity mt-0.5"
        aria-label="Delete field"
      >
        🗑
      </button>
    </div>
  )
}
