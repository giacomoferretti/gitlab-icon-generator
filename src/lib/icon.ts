import { createElement } from "react";
import { createLucideIcon } from "~/components/lucide";
import { SvgIcon } from "~/components/simple-icons";
import { DEFAULT_DIMENSIONS } from "~/constants";
import type { Icon, LucideIcon, SimpleIcon } from "~/types/icon";

const createElementLucide = (
  icon: LucideIcon,
  iconColor: string,
  iconSize: number = DEFAULT_DIMENSIONS.iconSize,
) => {
  const Comp = createLucideIcon(icon.icon);
  return createElement(Comp, {
    height: `${iconSize}px`,
    stroke: iconColor,
    width: `${iconSize}px`,
  });
};

const createElementSimple = (
  icon: SimpleIcon,
  iconColor: string,
  iconSize: number = DEFAULT_DIMENSIONS.iconSize,
) => {
  return createElement(SvgIcon, {
    fill: iconColor,
    height: `${iconSize}px`,
    path: icon.icon.path,
    title: icon.icon.title,
    width: `${iconSize}px`,
  });
};

export const createIconContent = (
  icon: Icon,
  iconColor: string,
  iconSize: number = DEFAULT_DIMENSIONS.iconSize,
): React.ReactNode => {
  if (icon.type === "lucide") {
    return createElementLucide(icon, iconColor, iconSize);
  }

  if (icon.type === "simple") {
    return createElementSimple(icon, iconColor, iconSize);
  }

  return null;
};

export const generateFilename = (config: {
  selectedIcon: string;
  iconColor: string;
  iconBackground: string;
  iconSize: number;
  outputSize: number;
  extension: string;
}): string => {
  const {
    selectedIcon,
    iconColor,
    iconBackground,
    iconSize,
    outputSize,
    extension,
  } = config;
  return `${selectedIcon}-${iconColor.substring(1)}-${iconBackground.substring(1)}-${iconSize}-${outputSize}.${extension}`.toLowerCase();
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
