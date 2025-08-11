import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Box, Flex, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import { clamp } from '@/format/number';
import { formatPascalCase } from '@/format/string';
import { getGradePoint } from '@/remotes/fetchers/me';
import { getMeQueryOptions } from '@/remotes/queries/me';
import type { GradePoint } from '@/types';
import { ProgressBar, Spacing, Text } from '@/ui-lib';

function getNextGradePoint(point: number, gradePoints: GradePoint[]) {
  const nextGradePoint = gradePoints.find(gradePoint => gradePoint.minPoint > point);
  if (!nextGradePoint) return null;
  return nextGradePoint;
}

function CurrentLevelSectionContainer() {
  const [
    {
      data: { grade, point },
    },
    {
      data: { gradePointList },
    },
  ] = useSuspenseQueries({
    queries: [getMeQueryOptions, { queryKey: ['grade-point-list'], queryFn: getGradePoint }],
  });

  // FIXME: nextGradePoint가 Null이라면, 최고 등급에 도달한 경우다. 널러쉬를 제거하자
  const nextGradePoint = getNextGradePoint(point, gradePointList) ?? {
    minPoint: 0,
  };

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        <Flex flexDir="column" gap={2}>
          <Text variant="H2_Bold">{formatPascalCase(grade)}</Text>

          <ProgressBar value={clamp(point / nextGradePoint.minPoint, 0, 1)} size="xs" />

          <Flex justifyContent="space-between">
            <Box textAlign="left">
              <Text variant="C1_Bold">현재 포인트</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {point}P
              </Text>
            </Box>
            <Box textAlign="right">
              <Text variant="C1_Bold">다음 등급까지</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {nextGradePoint.minPoint - point}P
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </styled.section>
  );
}

const CurrentLevelSection = () => {
  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense>
        <CurrentLevelSectionContainer />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CurrentLevelSection;
