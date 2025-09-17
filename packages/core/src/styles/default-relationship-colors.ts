import type { RelationshipColorValues, ThemeColor } from './types'

const gray = {
  line: '#6E6E6E',
  labelBg: '#18191b',
  label: '#C6C6C6',
} satisfies RelationshipColorValues
const slate = {
  line: '#64748b', // 500
  labelBg: '#0f172a', // 900
  label: '#cbd5e1', // 300
} satisfies RelationshipColorValues

const blue = {
  line: '#3b82f6', // 500
  labelBg: '#172554', // 950
  label: '#60a5fa', // 400
} satisfies RelationshipColorValues

const sky = {
  line: '#0ea5e9', // 500
  labelBg: '#082f49', // 950
  label: '#38bdf8', // 400
} satisfies RelationshipColorValues

export const RelationshipColors: Record<ThemeColor, RelationshipColorValues> = {
  amber: {
    line: '#b45309',
    labelBg: '#78350f',
    label: '#FFE0C2',
  },
  blue,
  gray,
  green: {
    line: '#15803d', // 700
    labelBg: '#052e16', // 950
    label: '#22c55e', // 500
  },
  indigo: {
    line: '#6366f1', // 500
    labelBg: '#1e1b4b', // 950
    label: '#818cf8', // 400
  },
  muted: slate,
  primary: blue,
  red: {
    line: '#AC4D39',
    labelBg: '#b91c1c',
    label: '#f5b2a3',
  },
  secondary: sky,
  sky,
  slate,
}
