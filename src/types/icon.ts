import type { IconType as SimpleIconsReactIconType } from "@icons-pack/react-simple-icons";
import type { IconNode as LucideIconType } from "lucide";
import type { LucideIcon as LucideReactIconType } from "lucide-react";
import type { SimpleIcon as SimpleIconsIconType } from "simple-icons";

export type LucideIcon = {
  type: "lucide";
  name: string;
  icon: LucideIconType;
  previewComponent: LucideReactIconType;
};

export type SimpleIcon = {
  type: "simple";
  name: string;
  icon: SimpleIconsIconType;
  previewComponent: SimpleIconsReactIconType;
};

export type Icon = LucideIcon | SimpleIcon;

export type Dimensions = {
  width: number;
  height: number;
  iconSize: number;
};
