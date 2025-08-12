import { Box, styled } from 'styled-system/jsx';

const IMAGE_SRC = '/moon-cheese-images/thumbnail.png';
const LOGO_TEXT_SRC = '/moon-cheese-images/logo-text.png';

function BannerSection() {
  return (
    <Box
      css={{
        position: 'relative',
      }}
    >
      <styled.img src={IMAGE_SRC} alt="banner" css={{ w: 'full', aspectRatio: 375 / 300, objectFit: 'cover' }} />
      <styled.img
        src={LOGO_TEXT_SRC}
        alt="banner"
        css={{
          w: '80%',
          left: '50%',
          transform: 'translateX(-50%)',
          objectFit: 'contain',
          position: 'absolute',
          bottom: '0.2rem',
        }}
      />
    </Box>
  );
}

export default BannerSection;
