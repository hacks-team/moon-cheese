import { CurrencyProvider } from '@/providers/CurrencyProvider';
import { Outlet } from 'react-router';
import { Box, Container } from 'styled-system/jsx';
import { Header } from './Header';

function PageLayout() {
  return (
    <CurrencyProvider>
      <Box minH="screen" bg="background.03_gray">
        <Container px={0}>
          <Header />
          <main>
            <Outlet />
          </main>
        </Container>
      </Box>
    </CurrencyProvider>
  );
}

export default PageLayout;
