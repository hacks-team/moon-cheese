import type { GradeType } from '@/coreBusiness/grade';
import type { GradePoint } from '@/queries/grade';

/**
 * 등급 목록에서 다음 등급을 찾습니다.
 * @returns 다음 등급 정보. 최고 등급이면 undefined
 */
export function findNextGrade(gradePointList: GradePoint[], currentGrade: GradeType): GradePoint | undefined {
  const currentIndex = gradePointList.findIndex(g => g.type === currentGrade);
  return gradePointList[currentIndex + 1];
}

/**
 * 현재 등급의 최소 포인트를 반환합니다.
 * @returns 현재 등급의 최소 포인트. 최고 등급이면 0
 */
export function getGradeMinPoint(gradePointList: GradePoint[], grade: GradeType): number {
  return gradePointList.find(g => g.type === grade)?.minPoint ?? 0;
}

/**
 * 다음 등급까지 필요한 포인트를 계산합니다. (정수로 반환)
 * @returns 다음 등급까지 남은 포인트. 최고 등급이면 0
 */
export function calcPointsToNextGrade(currentPoint: number, nextGradeMinPoint: number | undefined): number {
  if (nextGradeMinPoint === undefined) {
    return 0;
  }
  return Math.floor(Math.max(0, nextGradeMinPoint - currentPoint));
}

/**
 * 현재 등급 내에서의 진행률을 계산합니다. (0 ~ 1)
 * @returns 진행률. 최고 등급이면 1
 */
export function calcGradeProgress(
  currentPoint: number,
  currentGradeMinPoint: number,
  nextGradeMinPoint: number | undefined
): number {
  if (nextGradeMinPoint === undefined) {
    return 1;
  }
  const rangeTotal = nextGradeMinPoint - currentGradeMinPoint;
  const progress = currentPoint - currentGradeMinPoint;
  return Math.min(1, Math.max(0, progress / rangeTotal));
}
