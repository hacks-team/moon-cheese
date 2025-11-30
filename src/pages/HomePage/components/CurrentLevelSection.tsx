import ErrorSection from '@/components/ErrorSection';
import { getGradeLabel } from '@/coreBusiness/grade';
import { queries } from '@/queries';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { FallbackProps } from 'react-error-boundary';
import { Box, Flex, styled } from 'styled-system/jsx';
import { calcGradeProgress, calcPointsToNextGrade, findNextGrade, getGradeMinPoint } from '../utils/grade';

function CurrentLevelSection() {
  const { data: userData } = useSuspenseQuery(queries.user.me);
  const { data: gradePointData } = useSuspenseQuery(queries.grade.point);

  const { point: currentPoint, grade: currentGrade } = userData;
  const { gradePointList } = gradePointData;

  const nextGrade = findNextGrade(gradePointList, currentGrade);
  const currentGradeMinPoint = getGradeMinPoint(gradePointList, currentGrade);
  const pointsToNextGrade = calcPointsToNextGrade(currentPoint, nextGrade?.minPoint);
  const progressValue = calcGradeProgress(currentPoint, currentGradeMinPoint, nextGrade?.minPoint);
  const displayPoint = Math.floor(currentPoint);

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        <Flex flexDir="column" gap={2}>
          <Text variant="H2_Bold">{getGradeLabel(currentGrade)}</Text>

          <ProgressBar value={progressValue} size="xs" />

          <Flex justifyContent="space-between">
            <Box textAlign="left">
              <Text variant="C1_Bold">현재 포인트</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {displayPoint}P
              </Text>
            </Box>
            <Box textAlign="right">
              <Text variant="C1_Bold">다음 등급까지</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {nextGrade ? `${pointsToNextGrade}P` : '최고 등급'}
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </styled.section>
  );
}

function CurrentLevelSectionSkeleton() {
  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>
      <Spacing size={4} />
      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        <Flex flexDir="column" gap={2}>
          <Box css={{ w: 24, h: 6, bg: 'neutral.04_gray', rounded: 'md', animation: 'pulse' }} />
          <Box css={{ w: 'full', h: 1, bg: 'neutral.04_gray', rounded: 'full' }} />
          <Flex justifyContent="space-between">
            <Box>
              <Box css={{ w: 16, h: 4, bg: 'neutral.04_gray', rounded: 'md', mb: 1 }} />
              <Box css={{ w: 10, h: 3, bg: 'neutral.04_gray', rounded: 'md' }} />
            </Box>
            <Box textAlign="right">
              <Box css={{ w: 16, h: 4, bg: 'neutral.04_gray', rounded: 'md', mb: 1, ml: 'auto' }} />
              <Box css={{ w: 10, h: 3, bg: 'neutral.04_gray', rounded: 'md', ml: 'auto' }} />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </styled.section>
  );
}

function CurrentLevelSectionError({ resetErrorBoundary }: FallbackProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: queries.user.me.queryKey });
    queryClient.invalidateQueries({ queryKey: queries.grade.point.queryKey });
    resetErrorBoundary();
  };

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>
      <Spacing size={4} />
      <ErrorSection onRetry={handleRetry} />
    </styled.section>
  );
}

CurrentLevelSection.Skeleton = CurrentLevelSectionSkeleton;
CurrentLevelSection.Error = CurrentLevelSectionError;

export default CurrentLevelSection;
