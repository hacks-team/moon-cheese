import { PopoverContent, PopoverPositioner, PopoverRoot, PopoverTrigger } from '@ark-ui/react';
import { InfoIcon } from 'lucide-react';
import { styled } from 'styled-system/jsx';

const Tooltip = ({ label }: { label: string }) => {
  return (
    <PopoverRoot positioning={{ placement: 'bottom' }}>
      <PopoverTrigger asChild>
        <styled.button type="button" cursor="pointer" display="inline-flex" alignItems="center">
          <InfoIcon size={12} />
        </styled.button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent>
          <styled.div
            css={{
              bg: 'background.02_light-gray',
              color: 'text.01_black',
              px: 3,
              py: 2,
              rounded: 'lg',
              textStyle: 'C2_Regular',
              maxW: '200px',
              zIndex: 'tooltip',
            }}
          >
            {label}
          </styled.div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default Tooltip;
