export const GRADE = {
  EXPLORER: 'EXPLORER',
  PILOT: 'PILOT',
  COMMANDER: 'COMMANDER',
} as const;

export type Grade = (typeof GRADE)[keyof typeof GRADE];

export const GRADE_DISPLAY_NAME: Record<Grade, string> = {
  EXPLORER: 'Explorer',
  PILOT: 'Pilot',
  COMMANDER: 'Commander',
};
