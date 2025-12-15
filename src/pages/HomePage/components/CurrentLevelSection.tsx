import { Box, Flex, styled } from 'styled-system/jsx';
import { AsyncBoundary, ProgressBar, Spacing, Text } from '@/ui-lib';
import { useUserInfo } from '@/lib/api/user';
import { useGradePointList } from '@/lib/api/common';
import ErrorSection from '@/components/ErrorSection';
import { formatGrade } from '@/utils/format';
import { pointsToNextGrade, calculateGradeProgress } from '@/utils/calculate';

function CurrentLevelSection() {
  const userInfo = useUserInfo();
  const gradePointList = useGradePointList();
  const isLoading = userInfo.isFetching || gradePointList.isFetching;
  const isError = userInfo.isError || gradePointList.isError;
  const { grade: currentGrade, point: currentPoint } = userInfo.data;
  const gradeProgress = calculateGradeProgress(currentPoint, gradePointList.data);
  const nextGradePoint = pointsToNextGrade(currentPoint, gradePointList.data);

  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        <AsyncBoundary
          isLoading={isLoading}
          isError={isError}
          loadingFallback={<CurrentLevelSectionSkeleton />}
          errorFallback={
            <ErrorSection
              onRetry={() => {
                userInfo.refetch();
                gradePointList.refetch();
              }}
            />
          }
        >
          <Flex flexDir="column" gap={2}>
            <Text variant="H2_Bold">{formatGrade(currentGrade)}</Text>

            <ProgressBar value={gradeProgress} size="xs" />

            <Flex justifyContent="space-between">
              <Box textAlign="left">
                <Text variant="C1_Bold">현재 포인트</Text>
                <Text variant="C2_Regular" color="neutral.03_gray">
                  {currentPoint}p
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
        </AsyncBoundary>
      </Box>
    </styled.section>
  );
}

export default CurrentLevelSection;

function CurrentLevelSectionSkeleton() {
  return (
    <>
      <Flex flexDir="column" gap={2} css={{ animation: 'skeleton-pulse 2s infinite' }}>
        <Text css={{ w: '100px', h: '20px', rounded: 'lg', bg: 'gray.200' }} />

        <Box css={{ w: '100%', h: '12px', rounded: 'lg', bg: 'gray.200' }} />

        <Flex justifyContent="space-between">
          <Box>
            <Text css={{ w: '100px', h: '12px', rounded: 'lg', bg: 'gray.200' }} />
            <Text css={{ w: '30px', h: '12px', rounded: 'lg', bg: 'gray.200', marginTop: '4px' }} />
          </Box>
          <Box css={{ placeItems: 'end' }}>
            <Text css={{ w: '100px', h: '12px', rounded: 'lg', bg: 'gray.200' }} />
            <Text css={{ w: '30px', h: '12px', rounded: 'lg', bg: 'gray.200', marginTop: '4px' }} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
