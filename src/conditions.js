export const OPERATORS = [
  { key: 'filled',     label: 'is filled',        hasValue: false },
  { key: 'empty',      label: 'is empty',          hasValue: false },
  { key: 'equals',     label: 'equals',            hasValue: true  },
  { key: 'not_equals', label: 'does not equal',    hasValue: true  },
]

function evalCondition(cond, values) {
  const val = values[cond.fieldId]
  const filled = val !== undefined && val !== null && val !== '' && val !== false
  switch (cond.operator) {
    case 'filled':     return filled
    case 'empty':      return !filled
    case 'equals':     return String(val ?? '') === String(cond.value ?? '')
    case 'not_equals': return String(val ?? '') !== String(cond.value ?? '')
    default:           return true
  }
}

function evalRule(conditions, logic, values) {
  if (!conditions.length) return true
  const results = conditions.map((c) => evalCondition(c, values))
  return logic === 'any' ? results.some(Boolean) : results.every(Boolean)
}

/**
 * Returns { visible: bool, readonly: bool } for a field given current values.
 * Fields with no rules default to visible + editable.
 */
export function evalField(field, values = {}) {
  const display = field.displayRule ?? { type: 'always', logic: 'all', conditions: [] }
  const ro      = field.readonlyRule ?? { type: 'never',  logic: 'all', conditions: [] }

  let visible = true
  if (display.type === 'hidden') {
    visible = false
  } else if (display.type === 'show_when') {
    visible = evalRule(display.conditions, display.logic, values)
  }

  let readonly = false
  if (ro.type === 'always') {
    readonly = true
  } else if (ro.type === 'when') {
    readonly = evalRule(ro.conditions, ro.logic, values)
  }

  return { visible, readonly }
}
