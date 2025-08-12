import { Center, styled, VStack } from 'styled-system/jsx';
import { Button, Text } from '@/ui-lib';

function EmptyCartSection() {
  return (
    <Center p={5} aspectRatio={1} bgColor="background.01_white">
      <VStack gap={4} textAlign="center">
        <styled.img
          src="/moon-cheese-images/empty-cart.png"
          alt="empty-cart"
          css={{ w: '50%', h: 'auto', objectFit: 'contain' }}
        />
        <Text variant="B2_Bold">장바구니가 비어있어요</Text>
        <Text variant="C2_Regular">{'아직 아무것도 담지 않으셨네요\n쇼핑을 시작해볼까요?'}</Text>
        <Button>쇼핑하러 가기</Button>
      </VStack>
    </Center>
  );
}

export default EmptyCartSection;
