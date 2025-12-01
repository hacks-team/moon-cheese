import { ErrorBoundary } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { clamp } from 'es-toolkit';
import { Suspense } from 'react';
import { Box, Flex, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import { getGradeQueryOptions } from '@/remotes/queries/grade';
import { getMeQueryOptions } from '@/remotes/queries/me';
import type { Grade, GradePoint } from '@/type';
import { ProgressBar, Spacing, Text } from '@/ui-lib';

function getNextGradePoint(currentPoint: number, gradePointList: GradePoint[]) {
  const nextGradePoint = gradePointList.find(gradePoint => gradePoint.minPoint > currentPoint);
  if (typeof nextGradePoint === 'undefined') return null;

  return nextGradePoint.minPoint;
}

const formatCapitalize = (grade: Grade) => {
  switch (grade) {
    case 'PILOT':
      return 'Pilot';
    case 'COMMANDER':
      return 'Commander';
    case 'EXPLORER':
      return 'Explorer';
    default:
      grade satisfies never;
  }
};

function CurrentLevelSectionContainer() {
  const [
    {
      data: { grade, point },
    },
    {
      data: { gradePointList },
    },
  ] = useSuspenseQueries({
    queries: [getMeQueryOptions(), getGradeQueryOptions()],
  });

  const nextGradePoint = getNextGradePoint(point, gradePointList);
  const nextGradePointRatio = nextGradePoint ? point / nextGradePoint : 1;

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        <Flex flexDir="column" gap={2}>
          <Text variant="H2_Bold">{formatCapitalize(grade)}</Text>
          <ProgressBar value={clamp(nextGradePointRatio, 0, 1)} size="xs" />
          <Flex justifyContent="space-between">
            <Box textAlign="left">
              <Text variant="C1_Bold">현재 포인트</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {point}p
              </Text>
            </Box>
            <Box textAlign="right">
              <Text variant="C1_Bold">다음 등급까지</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {nextGradePoint}p
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </styled.section>
  );
}

const CurrentLevelSection = ErrorBoundary.with(
  {
    fallback: ({ reset }) => <ErrorSection onRetry={reset} />,
  },
  () => {
    return (
      <Suspense>
        <CurrentLevelSectionContainer />
      </Suspense>
    );
  }
);

export default CurrentLevelSection;
