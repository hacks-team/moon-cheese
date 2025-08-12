type SpacingProps = {
  size: number;
};

const Spacing = ({ size }: SpacingProps) => {
  return <div style={{ height: `${size * 4}px` }} />;
};

export default Spacing;
