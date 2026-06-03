import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { useStore } from './store'
import { FIELD_TYPE_MAP } from './fieldTypes'
import Header from './components/Header'
import Palette from './components/Palette'
import Canvas from './components/Canvas'
import ConfigPanel from './components/ConfigPanel'
import Preview from './components/Preview'
import SplashScreen from './components/SplashScreen'
import './index.css'

const SPLASH_KEY = 'catalog-designer-splash-seen'

export default function App() {
  const previewMode = useStore((s) => s.previewMode)
  const { item, addField, reorderFields, reorderSections } = useStore()
  const [activeDrag, setActiveDrag] = useState(null)
  const [showSplash, setShowSplash] = useState(() => !localStorage.getItem(SPLASH_KEY))

  function closeSplash() {
    localStorage.setItem(SPLASH_KEY, '1')
    setShowSplash(false)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const isPaletteDragging = activeDrag?.data.current?.source === 'palette'

  function handleDragStart({ active }) {
    setActiveDrag(active)
  }

  function handleDragEnd({ active, over }) {
    setActiveDrag(null)

    if (active.data.current?.source === 'palette') {
      const fieldType = active.data.current.fieldType
      if (!over) return

      // Explicit gap droppable: gap-{sectionId}-{index}
      if (over.id.startsWith('gap-')) {
        const parts = over.id.split('-')
        const index = parseInt(parts[parts.length - 1], 10)
        const sectionId = parts.slice(1, -1).join('-')
        addField(sectionId, fieldType, index)
        return
      }

      // Section background droppable
      if (over.id.startsWith('droppable-')) {
        addField(over.id.replace('droppable-', ''), fieldType)
        return
      }

      // Fell on a field card — append to that section
      for (const sec of item.sections) {
        if (sec.fields.some((f) => f.id === over.id)) {
          addField(sec.id, fieldType)
          return
        }
      }

      if (item.sections[0]) addField(item.sections[0].id, fieldType)
      return
    }

    if (!over) return

    // Reorder sections
    if (active.id.startsWith('section-') && over.id.startsWith('section-')) {
      const oldIdx = item.sections.findIndex((s) => `section-${s.id}` === active.id)
      const newIdx = item.sections.findIndex((s) => `section-${s.id}` === over.id)
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const next = [...item.sections]
        next.splice(newIdx, 0, next.splice(oldIdx, 1)[0])
        reorderSections(next)
      }
      return
    }

    // Reorder fields within a section
    const sourceSectionId = active.data.current?.sectionId
    const destSectionId = over.data.current?.sectionId
    if (sourceSectionId && sourceSectionId === destSectionId) {
      const section = item.sections.find((s) => s.id === sourceSectionId)
      if (!section) return
      const oldIdx = section.fields.findIndex((f) => f.id === active.id)
      const newIdx = section.fields.findIndex((f) => f.id === over.id)
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const next = [...section.fields]
        next.splice(newIdx, 0, next.splice(oldIdx, 1)[0])
        reorderFields(sourceSectionId, next)
      }
    }
  }

  if (previewMode) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header onHelp={() => setShowSplash(true)} />
        <Preview />
        {showSplash && <SplashScreen onClose={closeSplash} />}
      </div>
    )
  }

  const sectionSortIds = item.sections.map((s) => `section-${s.id}`)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen overflow-hidden">
        <Header onHelp={() => setShowSplash(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Palette />
          <Canvas sectionSortIds={sectionSortIds} isPaletteDragging={isPaletteDragging} />
          <ConfigPanel />
        </div>
      </div>

      {showSplash && <SplashScreen onClose={closeSplash} />}

      <DragOverlay dropAnimation={null}>
        {isPaletteDragging && (
          <div className="px-3 py-2 rounded-md bg-white border border-blue-400 shadow-lg text-sm text-blue-600 font-medium cursor-grabbing">
            {FIELD_TYPE_MAP[activeDrag.data.current.fieldType]?.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
