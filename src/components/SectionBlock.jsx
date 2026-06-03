import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import FieldCard from './FieldCard'
import { useStore } from '../store'

function SectionHeader({ section }) {
  const { updateSection, deleteSection, item } = useStore()
  const canDelete = item.sections.length > 1

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `section-${section.id}`, data: { type: 'section' } })

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 mb-2">
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
        aria-label="Drag section"
      >
        <GripVertical size={14} />
      </button>
      <input
        className="flex-1 text-sm font-semibold text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 outline-none py-0.5"
        value={section.title}
        onChange={(e) => updateSection(section.id, { title: e.target.value })}
        onClick={(e) => e.stopPropagation()}
      />
      {canDelete && (
        <button
          onClick={() => deleteSection(section.id)}
          className="text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Delete section"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  )
}

// An explicit droppable gap zone rendered between fields during a palette drag.
function GapDroppable({ id, isActive }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all ${isActive ? 'h-6' : 'h-2'}`}
    >
      {isOver && (
        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <div className="flex-1 h-0.5 bg-blue-400" />
        </div>
      )}
      {isActive && !isOver && (
        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 border-t border-dashed border-gray-300 pointer-events-none" />
      )}
    </div>
  )
}

export default function SectionBlock({ section, isPaletteDragging }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${section.id}`,
    data: { sectionId: section.id },
  })

  return (
    <div className="mb-4">
      <SectionHeader section={section} />
      <div
        ref={setNodeRef}
        className={`min-h-16 rounded-xl border-2 border-dashed p-2 flex flex-col transition-colors ${
          isOver && !isPaletteDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <SortableContext
          items={section.fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {section.fields.length === 0 ? (
            <>
              <GapDroppable
                id={`gap-${section.id}-0`}
                isActive={isPaletteDragging}
              />
              <p className="text-xs text-gray-400 text-center py-2 select-none">
                Drop a field here
              </p>
            </>
          ) : (
            <>
              <GapDroppable
                id={`gap-${section.id}-0`}
                isActive={isPaletteDragging}
              />
              {section.fields.map((field, idx) => (
                <div key={field.id}>
                  <FieldCard field={field} sectionId={section.id} />
                  <GapDroppable
                    id={`gap-${section.id}-${idx + 1}`}
                    isActive={isPaletteDragging}
                  />
                </div>
              ))}
            </>
          )}
        </SortableContext>
      </div>
    </div>
  )
}
