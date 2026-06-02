import { useStore } from '../store'

function FieldInput({ field }) {
  const base = 'w-full text-sm border border-gray-300 rounded px-3 py-2 bg-white outline-none'

  switch (field.type) {
    case 'string':
      return <input className={base} type="text" placeholder=" " />
    case 'text':
      return <textarea className={`${base} resize-none`} rows={3} />
    case 'integer':
    case 'decimal':
    case 'money':
      return <input className={base} type="number" />
    case 'boolean':
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"><input type="radio" /> True</label>
          <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"><input type="radio" /> False</label>
        </div>
      )
    case 'date':
      return <input className={base} type="date" />
    case 'datetime':
      return <input className={base} type="datetime-local" />
    case 'choice':
      return (
        <select className={base}>
          <option value="">Select an option</option>
          {(field.typeConfig?.options ?? []).map((o, i) => (
            <option key={i}>{o}</option>
          ))}
        </select>
      )
    case 'reference':
    case 'multi_reference':
      return (
        <input
          className={base}
          type="text"
          placeholder={`Search ${field.typeConfig?.table ?? 'records'}…`}
        />
      )
    case 'html':
      return (
        <div
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: field.typeConfig?.content ?? '' }}
        />
      )
    case 'acknowledgement':
      return (
        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" className="mt-0.5" />
          <span>{field.typeConfig?.statementText ?? 'I acknowledge…'}</span>
        </label>
      )
    default:
      return <input className={base} type="text" />
  }
}

function PreviewField({ field }) {
  const isDisplayOnly = field.type === 'html'
  return (
    <div className="flex flex-col gap-1">
      {!isDisplayOnly && (
        <label className="text-sm font-medium text-gray-700">
          {field.label || <span className="italic text-gray-400">Untitled field</span>}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {field.helpText && (
        <p className="text-xs text-gray-500">{field.helpText}</p>
      )}
      <FieldInput field={field} />
    </div>
  )
}

function NotesFlyover({ item }) {
  const annotatedFields = item.sections.flatMap((section) =>
    section.fields
      .filter((f) => f.notes)
      .map((f) => ({ ...f, sectionTitle: section.title }))
  )

  return (
    <div className="absolute inset-y-0 right-0 w-72 flex flex-col bg-white border-l border-amber-200 shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border-b border-amber-200 shrink-0">
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
          Notes ({annotatedFields.length})
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {annotatedFields.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <p className="text-sm text-gray-400 text-center">No notes on any fields yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {annotatedFields.map((field) => (
              <div key={field.id} className="px-4 py-3 hover:bg-amber-50 transition-colors">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <p className="text-xs font-semibold text-gray-700 leading-tight">
                    {field.label || <span className="italic text-gray-400">Untitled field</span>}
                  </p>
                </div>
                {item.sections.length > 1 && (
                  <p className="text-xs text-gray-400 mb-1 pl-3.5">{field.sectionTitle}</p>
                )}
                <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed pl-3.5">
                  {field.notes}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Preview() {
  const { item, showNotes } = useStore()

  return (
    <main className="relative flex-1 overflow-y-auto p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">{item.name || 'Untitled'}</h1>
          {item.description && (
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {item.sections.map((section) => (
            <div key={section.id} className="px-6 py-5">
              {(item.sections.length > 1 || section.title !== 'General') && (
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  {section.title}
                </h2>
              )}
              <div className="flex flex-col gap-5">
                {section.fields.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No fields in this section</p>
                ) : (
                  section.fields.map((field) => (
                    <PreviewField key={field.id} field={field} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            Save as draft
          </button>
          <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Next
          </button>
        </div>
      </div>

      {showNotes && <NotesFlyover item={item} />}
    </main>
  )
}
