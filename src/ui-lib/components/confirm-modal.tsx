import { Dialog, Portal } from '@ark-ui/react';
import type { ReactNode } from 'react';
import { css } from 'styled-system/css';
import { Flex, styled } from 'styled-system/jsx';
import Button from './button';
import Text from './text';

const ConfirmModal = ({
  trigger,
  title,
  description,
  onConfirm,
}: {
  trigger: ReactNode;
  title?: string;
  description: string;
  onConfirm: () => void;
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop
          className={css({
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 'overlay',
          })}
        />
        <Dialog.Positioner
          className={css({
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 'modal',
          })}
        >
          <Dialog.Content asChild>
            <styled.div
              css={{
                bg: 'background.01_white',
                rounded: 'xl',
                p: 5,
                w: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {title && (
                <Dialog.Title asChild>
                  <Text variant="B1_Bold">{title}</Text>
                </Dialog.Title>
              )}

              <Dialog.Description asChild>
                <Text variant="B2_Regular" color="text.02_gray">
                  {description}
                </Text>
              </Dialog.Description>

              <Flex gap={2} justify="flex-end">
                <Dialog.CloseTrigger asChild>
                  <Button color="neutral" size="sm">
                    취소
                  </Button>
                </Dialog.CloseTrigger>
                <Dialog.CloseTrigger asChild>
                  <Button color="primary" size="sm" onClick={onConfirm}>
                    확인
                  </Button>
                </Dialog.CloseTrigger>
              </Flex>
            </styled.div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ConfirmModal;
