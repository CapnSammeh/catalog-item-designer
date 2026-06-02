import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

const defaultSection = () => ({ id: uuid(), title: 'General', fields: [] })

const defaultItem = () => ({
  id: uuid(),
  name: 'New Catalog Item',
  description: '',
  category: '',
  sections: [defaultSection()],
})

export const useStore = create((set, get) => ({
  item: defaultItem(),
  selectedFieldId: null,
  selectedSectionId: null,
  previewMode: false,
  showNotes: false,

  // Item metadata
  updateItem: (patch) =>
    set((s) => ({ item: { ...s.item, ...patch } })),

  // Sections
  addSection: () =>
    set((s) => ({
      item: {
        ...s.item,
        sections: [...s.item.sections, { id: uuid(), title: 'New Section', fields: [] }],
      },
    })),

  updateSection: (sectionId, patch) =>
    set((s) => ({
      item: {
        ...s.item,
        sections: s.item.sections.map((sec) =>
          sec.id === sectionId ? { ...sec, ...patch } : sec
        ),
      },
    })),

  deleteSection: (sectionId) =>
    set((s) => ({
      item: {
        ...s.item,
        sections: s.item.sections.filter((sec) => sec.id !== sectionId),
      },
      selectedFieldId: null,
      selectedSectionId: null,
    })),

  reorderSections: (newSections) =>
    set((s) => ({ item: { ...s.item, sections: newSections } })),

  // Fields
  addField: (sectionId, type, atIndex = null) => {
    const newField = {
      id: uuid(),
      type,
      label: '',
      helpText: '',
      required: false,
      typeConfig: {},
      notes: '',
    }
    set((s) => ({
      item: {
        ...s.item,
        sections: s.item.sections.map((sec) => {
          if (sec.id !== sectionId) return sec
          const fields = [...sec.fields]
          if (atIndex === null || atIndex >= fields.length) {
            fields.push(newField)
          } else {
            fields.splice(atIndex, 0, newField)
          }
          return { ...sec, fields }
        }),
      },
      selectedFieldId: newField.id,
      selectedSectionId: sectionId,
    }))
  },

  updateField: (sectionId, fieldId, patch) =>
    set((s) => ({
      item: {
        ...s.item,
        sections: s.item.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                fields: sec.fields.map((f) =>
                  f.id === fieldId ? { ...f, ...patch } : f
                ),
              }
            : sec
        ),
      },
    })),

  deleteField: (sectionId, fieldId) =>
    set((s) => ({
      item: {
        ...s.item,
        sections: s.item.sections.map((sec) =>
          sec.id === sectionId
            ? { ...sec, fields: sec.fields.filter((f) => f.id !== fieldId) }
            : sec
        ),
      },
      selectedFieldId: s.selectedFieldId === fieldId ? null : s.selectedFieldId,
    })),

  reorderFields: (sectionId, newFields) =>
    set((s) => ({
      item: {
        ...s.item,
        sections: s.item.sections.map((sec) =>
          sec.id === sectionId ? { ...sec, fields: newFields } : sec
        ),
      },
    })),

  // Selection
  selectField: (fieldId, sectionId) =>
    set({ selectedFieldId: fieldId, selectedSectionId: sectionId }),

  clearSelection: () =>
    set({ selectedFieldId: null, selectedSectionId: null }),

  // Import / export
  exportJSON: () => {
    const { item } = get()
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.name.replace(/\s+/g, '_') || 'catalog_item'}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  importJSON: (json) => {
    try {
      const parsed = JSON.parse(json)
      if (!parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error('Invalid format: missing sections array')
      }
      set({ item: { ...defaultItem(), ...parsed }, selectedFieldId: null, selectedSectionId: null })
      return null
    } catch (e) {
      return e.message
    }
  },

  // Preview
  togglePreview: () => set((s) => ({ previewMode: !s.previewMode })),
  toggleShowNotes: () => set((s) => ({ showNotes: !s.showNotes })),
}))
