import { createElement, type FunctionComponent } from "react";

export const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} satisfies React.SVGAttributes<SVGSVGElement>;

export type IconNode = [
  elementName: string, // keyof JSX.IntrinsicElements,
  attrs: Record<string, string | number>,
][];

export interface LucideProps
  extends Partial<Omit<React.SVGAttributes<SVGSVGElement>, "ref" | "size">> {
  color?: string;
  size?: string | number;
  strokeWidth?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type LucideIcon = FunctionComponent<LucideProps>;

interface IconComponentProps extends LucideProps {
  iconNode: IconNode;
}

/**
 * Lucide icon component
 *
 * @component Icon
 * @param {object} props
 * @param {string} props.color - The color of the icon
 * @param {number} props.size - The size of the icon
 * @param {number} props.strokeWidth - The stroke width of the icon
 * @param {boolean} props.absoluteStrokeWidth - Whether to use absolute stroke width
 * @param {string} props.className - The class name of the icon
 * @param {IconNode} props.children - The children of the icon
 * @param {IconNode} props.iconNode - The icon node of the icon
 *
 * @returns {JSX.Element} LucideIcon
 */
export const Icon: React.FC<IconComponentProps> = ({
  color = "currentColor",
  size = 24,
  strokeWidth = 2,
  absoluteStrokeWidth,
  children,
  iconNode,
  className = "",
  ...rest
}) => {
  return (
    <svg
      {...defaultAttributes}
      className={["lucide", className].join(" ")}
      height={size}
      role="graphics-symbol"
      stroke={color}
      strokeWidth={
        absoluteStrokeWidth
          ? (Number(strokeWidth) * 24) / Number(size)
          : strokeWidth
      }
      width={String(size)}
      {...rest}
    >
      {iconNode.map(([tag, attrs], i) =>
        createElement(tag, { key: i, ...attrs }),
      )}
      {children}
    </svg>
  );
};

export type CamelToPascal<T extends string> =
  T extends `${infer FirstChar}${infer Rest}`
    ? `${Capitalize<FirstChar>}${Rest}`
    : never;

export const toKebabCase = (string: string) =>
  string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const toCamelCase = <T extends string>(string: T) =>
  string.replace(/^([A-Z])|[\s-_]+(\w)/g, (_match, p1, p2) =>
    p2 ? p2.toUpperCase() : p1.toLowerCase(),
  );

export const toPascalCase = <T extends string>(string: T): CamelToPascal<T> => {
  const camelCase = toCamelCase(string);

  return (camelCase.charAt(0).toUpperCase() +
    camelCase.slice(1)) as CamelToPascal<T>;
};

// https://github.com/vercel/satori/issues/570
export const createLucideIcon = (iconNode: IconNode) => {
  return ({ ...props }: LucideProps) =>
    createElement(Icon, {
      iconNode,
      ...props,
    });
};
