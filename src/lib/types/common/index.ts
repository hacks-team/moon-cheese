export type CurrencyType = 'KRW' | 'USD';

export type GradeType = 'EXPLORER' | 'PILOT' | 'COMMANDER';
export type GradePointListItem = {
  type: GradeType;
  minPoint: number;
};
