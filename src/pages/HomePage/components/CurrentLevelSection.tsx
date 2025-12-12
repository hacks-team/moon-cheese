import { Box, Flex, styled } from 'styled-system/jsx';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import ErrorSection from '@/components/ErrorSection';
import { GRADE_DISPLAY_NAME } from '@/constants/grade';
import { userQueryOptions } from '@/remotes/queries/user';
import { gradePointQueryOptions } from '@/remotes/queries/grade';
import { type ReactNode } from 'react';
import type { Me } from '@/remotes/user';
import type { GradePoint } from '@/remotes/grade';
import { useSuspenseQueries } from '@tanstack/react-query';
import AsyncBoundary from '@/components/AsyncBoundary';

const CurrentLevelSection = () => {
  return (
    <AsyncBoundary
      errorFallback={({ onRetry }) => <ErrorSection onRetry={onRetry} />}
      suspenseFallback={<CurrentLevelSkeleton />}
    >
      <CurrentLevelSectionContainer />
    </AsyncBoundary>
  );
};

const CurrentLevelSectionContainer = () => {
  const [{ data: me }, { data: gradePoint }] = useSuspenseQueries({
    queries: [userQueryOptions.me(), gradePointQueryOptions.gradePoint()],
  });

  return (
    <SectionWrapper>
      <Flex flexDir="column" gap={2}>
        <Text variant="H2_Bold">{GRADE_DISPLAY_NAME[me.grade]}</Text>

        <ProgressBar value={getNextGradeInfo(me, gradePoint).progress} size="xs" />

        <Flex justifyContent="space-between">
          <Box textAlign="left">
            <Text variant="C1_Bold">현재 포인트</Text>
            <Text variant="C2_Regular" color="neutral.03_gray">
              {me.point}p
            </Text>
          </Box>
          <Box textAlign="right">
            <Text variant="C1_Bold">다음 등급까지</Text>
            <Text variant="C2_Regular" color="neutral.03_gray">
              {getNextGradeInfo(me, gradePoint).pointsNeeded}p
            </Text>
          </Box>
        </Flex>
      </Flex>
    </SectionWrapper>
  );
};

/**
 * 유저의 현재 등급을 받아 다음 등급을 찾는 함수
 * @returns 다음 등급 정보 및 다음 등급까지 필요한 포인트, 포인트 프로그레스 수치
 */
const getNextGradeInfo = (
  currentInfo: Me,
  gradePoints: GradePoint[]
): { nextGrade: GradePoint | null; pointsNeeded: number; progress: number } => {
  const { point: currentPoint, grade: myGrade } = currentInfo;

  // minPoint 기준 오름차순 정렬
  const sorted = [...gradePoints].sort((a, b) => a.minPoint - b.minPoint);

  // 현재 포인트보다 minPoint가 큰 첫 번째 등급 = 다음 등급
  const nextGrade = sorted.find(grade => grade.minPoint > currentPoint);

  const currentGrade = sorted.find(grade => grade.type === myGrade);

  if (!currentGrade || !nextGrade) {
    // 최고 등급이거나 데이터에 이상이 있을 경우
    return { nextGrade: null, pointsNeeded: 0, progress: 1 };
  }

  const currentMin = currentGrade.minPoint;
  const nextMin = nextGrade.minPoint;

  return {
    nextGrade,
    pointsNeeded: nextMin - currentPoint,
    progress: (currentPoint - currentMin) / (nextMin - currentMin),
  };
};

// 레이아웃 컴포넌트
const SectionWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        {children}
      </Box>
    </styled.section>
  );
};

// 스켈레톤 컴포넌트
const CurrentLevelSkeleton = () => {
  return (
    <SectionWrapper>
      <Flex flexDir="column" gap={2}>
        {/* 등급 이름 스켈레톤 */}
        <styled.div
          css={{
            w: '80px',
            h: '24px',
            rounded: 'md',
            bg: 'background.02_light-gray',
            animation: 'skeleton-pulse',
          }}
        ></styled.div>

        <ProgressBar value={0} size="xs" />

        <Flex justifyContent="space-between">
          <Box textAlign="left">
            <Text variant="C1_Bold">현재 포인트</Text>
            {/* 현재 포인트 스켈레톤 */}
            <styled.div
              css={{
                w: '32px',
                h: '16px',
                rounded: 'md',
                bg: 'background.02_light-gray',
                animation: 'skeleton-pulse',
              }}
            ></styled.div>
          </Box>
          <Box textAlign="right">
            <Text variant="C1_Bold">다음 등급까지</Text>
            {/* 남은 포인트 스켈레톤 */}
            <styled.div
              css={{
                w: '32px',
                h: '16px',
                rounded: 'md',
                bg: 'background.02_light-gray',
                animation: 'skeleton-pulse',
              }}
            ></styled.div>
          </Box>
        </Flex>
      </Flex>
    </SectionWrapper>
  );
};

export default CurrentLevelSection;
