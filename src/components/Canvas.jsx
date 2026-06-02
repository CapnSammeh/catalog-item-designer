import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useStore } from '../store'
import SectionBlock from './SectionBlock'

export default function Canvas({ sectionSortIds, isPaletteDragging }) {
  const { item, updateItem } = useStore()

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <textarea
            className="w-full text-sm text-gray-500 bg-transparent border-none outline-none resize-none placeholder-gray-300"
            rows={2}
            value={item.description}
            onChange={(e) => updateItem({ description: e.target.value })}
            placeholder="Add a description for this catalog item…"
          />
        </div>

        <SortableContext items={sectionSortIds} strategy={verticalListSortingStrategy}>
          {item.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              isPaletteDragging={isPaletteDragging}
            />
          ))}
        </SortableContext>
      </div>
    </main>
  )
}
