import { Button, Text } from '@/ui-lib';
import { Center, styled, VStack } from 'styled-system/jsx';

type ErrorSectionProps = {
  onRetry?: () => void;
};

function ErrorSection({ onRetry }: ErrorSectionProps) {
  return (
    <Center p={5} aspectRatio={1} bgColor="background.01_white">
      <VStack gap={4}>
        <VStack gap={2} textAlign="center">
          <styled.img src="/error-image.png" alt="error" w={100} />

          <Text variant="B2_Bold">서버 연결에 실패했어요</Text>
          <Text variant="C2_Regular">{'잠시 후 다시 시도해주세요.\n문제가 계속되면 고객센터에 문의해주세요.'}</Text>
        </VStack>
        <Button onClick={onRetry}>다시 시도하기</Button>
      </VStack>
    </Center>
  );
}

export default ErrorSection;
