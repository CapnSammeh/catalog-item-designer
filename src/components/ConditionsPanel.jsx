import { v4 as uuid } from 'uuid'
import { Plus, Trash2 } from 'lucide-react'
import { OPERATORS } from '../conditions'
import { useStore } from '../store'

function ConditionRow({ cond, allFields, onUpdate, onDelete }) {
  const opMeta = OPERATORS.find((o) => o.key === cond.operator) ?? OPERATORS[0]

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <select
        className="flex-1 min-w-0 text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-blue-400 bg-white"
        value={cond.fieldId ?? ''}
        onChange={(e) => onUpdate({ ...cond, fieldId: e.target.value })}
      >
        <option value="">Select field…</option>
        {allFields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label || `(${f.type})`}
          </option>
        ))}
      </select>

      <select
        className="text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-blue-400 bg-white"
        value={cond.operator ?? 'filled'}
        onChange={(e) => onUpdate({ ...cond, operator: e.target.value, value: '' })}
      >
        {OPERATORS.map((o) => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>

      {opMeta.hasValue && (
        <input
          className="w-24 text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-blue-400"
          placeholder="value"
          value={cond.value ?? ''}
          onChange={(e) => onUpdate({ ...cond, value: e.target.value })}
        />
      )}

      <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition-colors shrink-0" aria-label="Remove condition">
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function RuleSection({ title, rule, onUpdate, allFields, typeOptions, hint }) {
  const isConditional = rule.type === typeOptions[typeOptions.length - 1].value

  function addCondition() {
    onUpdate({ ...rule, conditions: [...rule.conditions, { id: uuid(), fieldId: '', operator: 'filled', value: '' }] })
  }
  function updateCondition(idx, patch) {
    onUpdate({ ...rule, conditions: rule.conditions.map((c, i) => (i === idx ? patch : c)) })
  }
  function deleteCondition(idx) {
    onUpdate({ ...rule, conditions: rule.conditions.filter((_, i) => i !== idx) })
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
      <div className="flex flex-col gap-1.5 mb-3">
        {typeOptions.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={title} checked={rule.type === value} onChange={() => onUpdate({ ...rule, type: value })} />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {isConditional && (
        <div className="pl-3 border-l-2 border-blue-100 flex flex-col gap-2">
          <p className="text-xs text-gray-400 mb-0.5">{hint}</p>
          {rule.conditions.map((cond, idx) => (
            <div key={cond.id}>
              {idx > 0 && (
                <div className="flex justify-start my-1">
                  <button
                    onClick={() => onUpdate({ ...rule, logic: rule.logic === 'all' ? 'any' : 'all' })}
                    className="text-xs font-bold text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded"
                    title="Click to toggle AND / OR"
                  >
                    {rule.logic === 'all' ? 'AND' : 'OR'}
                  </button>
                </div>
              )}
              <ConditionRow cond={cond} allFields={allFields} onUpdate={(p) => updateCondition(idx, p)} onDelete={() => deleteCondition(idx)} />
            </div>
          ))}
          <button onClick={addCondition} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-0.5">
            <Plus size={12} /> Add condition
          </button>
        </div>
      )}
    </div>
  )
}

const DISPLAY_OPTIONS = [
  { value: 'always',    label: 'Always visible' },
  { value: 'hidden',    label: 'Always hidden' },
  { value: 'show_when', label: 'Show only when…' },
]

const READONLY_OPTIONS = [
  { value: 'never',  label: 'Always editable' },
  { value: 'always', label: 'Always read-only' },
  { value: 'when',   label: 'Read-only when…' },
]

export default function ConditionsPanel({ field, sectionId, allFields }) {
  const updateField = useStore((s) => s.updateField)
  const displayRule  = field.displayRule  ?? { type: 'always', logic: 'all', conditions: [] }
  const readonlyRule = field.readonlyRule ?? { type: 'never',  logic: 'all', conditions: [] }
  const otherFields  = allFields.filter((f) => f.id !== field.id)

  return (
    <div className="flex flex-col gap-5">
      <RuleSection
        title="Visibility"
        rule={displayRule}
        onUpdate={(r) => updateField(sectionId, field.id, { displayRule: r })}
        allFields={otherFields}
        typeOptions={DISPLAY_OPTIONS}
        hint="Show this field when the following conditions are met:"
      />
      <div className="border-t border-gray-100" />
      <RuleSection
        title="Read-only"
        rule={readonlyRule}
        onUpdate={(r) => updateField(sectionId, field.id, { readonlyRule: r })}
        allFields={otherFields}
        typeOptions={READONLY_OPTIONS}
        hint="Make this field read-only when the following conditions are met:"
      />
    </div>
  )
}
