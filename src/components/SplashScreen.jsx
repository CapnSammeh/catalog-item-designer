const STEPS = [
  {
    icon: '⠿',
    title: 'Build your form',
    body: 'Drag any field type from the left palette onto the canvas — or click to append. Drop between existing fields to insert at a specific position.',
  },
  {
    icon: '☰',
    title: 'Organise with sections',
    body: 'Click "+ Add Section" to group related fields under a named heading. Drag the ⠿ handle to reorder sections and fields.',
  },
  {
    icon: '🖊',
    title: 'Configure each field',
    body: 'Click any field card to open the config panel. Set the label, help text, and required flag. Use the Notes tab to leave implementation guidance for your developer.',
  },
  {
    icon: '👁',
    title: 'Preview as a user',
    body: 'Hit Preview to see the live form. All fields are interactive. Toggle Notes on to see a flyover sidebar of your implementation notes alongside the form.',
  },
  {
    icon: '⬇',
    title: 'Export & share',
    body: 'Export downloads your design as a JSON file. Import loads it back on any device. Use "Use with Claude" to let AI generate designs from a plain-English description.',
  },
]

export default function SplashScreen({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome to Catalog Item Designer
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                A visual tool for designing Servicely Service Catalog Items — drag fields, add notes, preview and share.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="px-8 py-6 flex flex-col gap-5 overflow-y-auto">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base shrink-0 font-mono">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            You can reopen this guide any time from the <span className="font-medium text-gray-500">?</span> button in the header.
          </p>
          <button
            onClick={onClose}
            className="shrink-0 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  )
}
