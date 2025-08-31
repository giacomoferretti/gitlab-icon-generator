import type { Dimensions } from "./types/icon";

export const DEFAULT_DIMENSIONS = {
  width: 192,
  height: 192,
  iconSize: 128,
} as const satisfies Dimensions;
