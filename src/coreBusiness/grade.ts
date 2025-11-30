export const GRADE_CONFIG = {
  EXPLORER: { label: 'Explorer' },
  PILOT: { label: 'Pilot' },
  COMMANDER: { label: 'Commander' },
} as const;

export type GradeType = keyof typeof GRADE_CONFIG;

export function getGradeLabel(grade: GradeType): string {
  return GRADE_CONFIG[grade].label;
}
