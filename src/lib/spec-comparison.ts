/* ── T-APEX vs 1080 Sprint 2 — published specification comparison ────────────
   Manufacturer-listed figures for both machines, grouped the way the spec
   sheets group them. Lives here rather than inside a component so the summary
   strip in ComparisonSection and the full-comparison popup read from one
   source — the two can't drift apart.

   Honesty rules this table lives by, because a spec sheet that only flatters
   one side is worth nothing to a coach:
   - `'—'` means *the manufacturer does not publish that figure*, not zero and
     not "worse". Rows where T-APEX is the blank one stay in.
   - `lead` marks which machine leads a row on its published number, and it is
     set to `'sprint'` wherever 1080 genuinely leads (max overspeed value, jump
     training, cable length, output power). Don't quietly drop those rows.
   - No figure here is ours to round or restate. Update it only against the
     published spec.                                                          */

export type SpecRow = {
  label: string
  apex: string
  sprint: string
  /** Which machine leads this row on its published figure, where one does. */
  lead?: 'apex' | 'sprint'
}

export type SpecGroup = {
  id: string
  title: string
  rows: SpecRow[]
  /** The neutral one-line read on the group, as published. */
  note: string
}

/** The value used when a figure isn't published for a machine. */
export const NOT_LISTED = '—'

/** The six rows a coach decides on — the summary strip on the page. */
export const HEADLINE_SPECS: SpecRow[] = [
  { label: 'Entry cost', apex: '$5,000', sprint: '$15,000+', lead: 'apex' },
  { label: 'Peak resistance', apex: 'Up to 90kg', sprint: 'Up to 70kg', lead: 'apex' },
  { label: 'Custom segments', apex: 'Up to 10', sprint: '2', lead: 'apex' },
  { label: 'Data sampling rate', apex: '1000Hz', sprint: '200Hz', lead: 'apex' },
  { label: 'Cable load capacity', apex: '300kg', sprint: '150kg', lead: 'apex' },
  { label: 'Battery capacity', apex: '152Wh', sprint: '99Wh', lead: 'apex' },
]

/** Everything else — the full sheet behind the "View Full Comparison" popup. */
export const SPEC_GROUPS: SpecGroup[] = [
  {
    id: 'cost-control',
    title: 'Cost & Core Control',
    rows: [
      { label: 'Price', apex: '$5,000', sprint: '$15,000+', lead: 'apex' },
      { label: 'Custom segments', apex: 'Up to 10 segments', sprint: '2 segments', lead: 'apex' },
      { label: 'Max assistance', apex: '15kg', sprint: NOT_LISTED, lead: 'apex' },
      { label: 'Max overspeed value', apex: '7m/s', sprint: '14m/s', lead: 'sprint' },
      { label: 'Acceleration-assisted speed', apex: 'Up to 14m/s', sprint: NOT_LISTED, lead: 'apex' },
    ],
    note: 'T-APEX offers a lower entry cost with more programmable segment control.',
  },
  {
    id: 'resistance-output',
    title: 'Resistance Output',
    rows: [
      { label: 'Regular resistance', apex: '20kg / 44lbs', sprint: '20kg / 44lbs' },
      { label: 'Regular resistance peak', apex: '30kg for 10s; 45kg for 2–3s', sprint: NOT_LISTED, lead: 'apex' },
      { label: 'Pulley / Overload setup', apex: '40kg / 88lbs', sprint: '40kg / 88lbs' },
      { label: 'Pulley / Overload peak', apex: '60kg for 10s; 90kg for 2–3s', sprint: '70kg for 2–3s', lead: 'apex' },
      { label: 'Suitable for jump training', apex: NOT_LISTED, sprint: 'Yes', lead: 'sprint' },
    ],
    note: 'T-APEX supports higher listed peak resistance with the Overload Kit.',
  },
  {
    id: 'data-reporting',
    title: 'Data & Reporting',
    rows: [
      { label: 'Records maximum speed', apex: 'Yes', sprint: 'Yes' },
      { label: 'Step path diagram', apex: 'Yes', sprint: 'Yes' },
      { label: 'Load-speed relationship chart', apex: 'Yes', sprint: 'Yes' },
      { label: 'Data transfer', apex: 'Bluetooth', sprint: 'Built-in display' },
      { label: 'Display device', apex: 'Independent tablet', sprint: 'Integrated display' },
      { label: 'Data sampling rate', apex: '1000Hz', sprint: '200Hz', lead: 'apex' },
    ],
    note: 'Both support training data, while T-APEX lists a higher sampling rate.',
  },
  {
    id: 'hardware-field',
    title: 'Hardware & Field Setup',
    rows: [
      { label: 'Cable length', apex: '120m', sprint: '120m, up to 180m', lead: 'sprint' },
      { label: 'Cable diameter', apex: '2mm', sprint: NOT_LISTED },
      { label: 'Cable load capacity', apex: '300kg', sprint: '150kg', lead: 'apex' },
      { label: 'Product weight', apex: '20kg / 44lbs', sprint: '25kg / 55lbs', lead: 'apex' },
      { label: 'Main unit dimensions', apex: '439 × 355 × 325mm', sprint: '274 × 304 × 304mm' },
      { label: 'Battery type', apex: NOT_LISTED, sprint: 'Lithium iron phosphate', lead: 'sprint' },
    ],
    note: 'T-APEX has higher listed cable load capacity and a lighter main unit.',
  },
  {
    id: 'battery-power',
    title: 'Battery & Power',
    rows: [
      { label: 'Battery capacity', apex: '152Wh', sprint: '99Wh', lead: 'apex' },
      { label: 'Charging cable', apex: NOT_LISTED, sprint: '41.4V, 160W', lead: 'sprint' },
      { label: 'Charging cable length', apex: NOT_LISTED, sprint: '2m / 6ft', lead: 'sprint' },
      { label: 'FAA airline compliance', apex: 'Yes', sprint: 'Yes' },
      { label: 'Maximum output power', apex: NOT_LISTED, sprint: '1500W', lead: 'sprint' },
    ],
    note: 'T-APEX lists a larger battery capacity for portable field use.',
  },
]

/** The three things the spec sheet adds up to, for the on-page summary. */
export const SPEC_TAKEAWAYS = [
  'Lower equipment cost',
  'Higher data sampling rate',
  'More programmable segments',
]
