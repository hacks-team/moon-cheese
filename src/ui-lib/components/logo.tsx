type Props = {
  height?: number;
};

function Logo({ height = 20 }: Props) {
  return <img src="/logo.png" alt="logo" style={{ height }} />;
}

export default Logo;
