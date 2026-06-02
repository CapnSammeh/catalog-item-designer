export const FIELD_TYPES = [
  { key: 'string',           label: 'String',             icon: 'Aa' },
  { key: 'text',             label: 'Text',               icon: '¶'  },
  { key: 'integer',          label: 'Integer',            icon: '123' },
  { key: 'decimal',          label: 'Decimal',            icon: '1.5' },
  { key: 'money',            label: 'Money',              icon: '$'  },
  { key: 'boolean',          label: 'Boolean',            icon: '☑'  },
  { key: 'date',             label: 'Date',               icon: '📅' },
  { key: 'datetime',         label: 'Date and Time',      icon: '🕐' },
  { key: 'choice',           label: 'Choice',             icon: '▾'  },
  { key: 'reference',        label: 'Reference',          icon: '↗'  },
  { key: 'multi_reference',  label: 'Multiple Reference', icon: '↗↗' },
  { key: 'html',             label: 'HTML',               icon: '<>' },
  { key: 'acknowledgement',  label: 'Acknowledgement',    icon: '✓'  },
]

export const FIELD_TYPE_MAP = Object.fromEntries(FIELD_TYPES.map((t) => [t.key, t]))
