import {
  Baseline,
  AlignLeft,
  Hash,
  Divide,
  DollarSign,
  ToggleLeft,
  Calendar,
  CalendarClock,
  ListChecks,
  Link,
  Link2,
  Code2,
  ClipboardCheck,
} from 'lucide-react'

export const FIELD_TYPES = [
  { key: 'string',          label: 'String',             Icon: Baseline       },
  { key: 'text',            label: 'Text',               Icon: AlignLeft      },
  { key: 'integer',         label: 'Integer',            Icon: Hash           },
  { key: 'decimal',         label: 'Decimal',            Icon: Divide         },
  { key: 'money',           label: 'Money',              Icon: DollarSign     },
  { key: 'boolean',         label: 'Boolean',            Icon: ToggleLeft     },
  { key: 'date',            label: 'Date',               Icon: Calendar       },
  { key: 'datetime',        label: 'Date and Time',      Icon: CalendarClock  },
  { key: 'choice',          label: 'Choice',             Icon: ListChecks     },
  { key: 'reference',       label: 'Reference',          Icon: Link           },
  { key: 'multi_reference', label: 'Multiple Reference', Icon: Link2          },
  { key: 'html',            label: 'HTML',               Icon: Code2          },
  { key: 'acknowledgement', label: 'Acknowledgement',    Icon: ClipboardCheck },
]

export const FIELD_TYPE_MAP = Object.fromEntries(FIELD_TYPES.map((t) => [t.key, t]))
