type SimpleIconProps = React.SVGProps<SVGSVGElement> & {
  title: string;
  path: string;
};

export const SvgIcon: React.FC<SimpleIconProps> = ({
  title,
  path,
  ...props
}) => {
  return (
    <svg
      role="graphics-symbol"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={path} />
    </svg>
  );
};
