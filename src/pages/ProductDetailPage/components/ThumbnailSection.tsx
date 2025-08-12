import { useState } from 'react';
import { HStack, styled } from 'styled-system/jsx';

type ThumbnailSectionProps = {
  images: string[];
};

function ThumbnailSection({ images }: ThumbnailSectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <styled.section css={{ bg: 'background.01_white' }}>
      <styled.img
        src={images[selectedImageIndex]}
        alt={'product-main-image'}
        css={{
          w: 'full',
          aspectRatio: 1,
          objectFit: 'cover',
          bg: 'background.01_gray',
        }}
      />

      {/* 썸네일 이미지 */}
      <HStack gap={2} css={{ overflowX: 'auto', justifyContent: 'center', pt: 2 }}>
        {images.map((image, index) => (
          <styled.img
            key={`thumbnail-${index}`}
            src={image}
            alt={`product-image-${index + 1}`}
            onClick={() => setSelectedImageIndex(index)}
            role="button"
            css={{
              w: 12,
              h: 12,
              objectFit: 'cover',
              cursor: 'pointer',
              outline: selectedImageIndex === index ? '1px solid' : 'none',
              outlineColor: 'primary.01_primary',
              outlineOffset: selectedImageIndex === index ? '-1px' : 0,
              rounded: 'md',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          />
        ))}
      </HStack>
    </styled.section>
  );
}

export default ThumbnailSection;
