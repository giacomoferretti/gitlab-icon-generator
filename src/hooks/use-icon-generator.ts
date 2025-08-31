import { createElement, useEffect, useState } from "react";
import type { Font as FontOptions } from "satori";
import satori from "satori";
import { DEFAULT_DIMENSIONS } from "~/constants";
import { createIconContent } from "~/lib/icon";
import type { Dimensions, Icon } from "~/types/icon";
import { useObjectUrl } from "./use-object-url";

type UseIconGeneratorParams = {
  icon: Icon | null;
  iconColor: string;
  iconBackground: string;
  dimensions?: Dimensions;
  generateResvg: (svg: string, width: number) => Promise<string>;
  fonts: FontOptions[];
};

const generateSvg = async ({
  content,
  iconBackground,
  width,
  height,
  fonts,
}: {
  content: React.ReactNode;
  iconBackground: string;
  width: number;
  height: number;
  fonts: FontOptions[];
}): Promise<string> => {
  return await satori(
    createElement(
      "div",
      {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: iconBackground,
        },
      },
      content,
    ),
    {
      width,
      height,
      fonts,
    },
  );
};

const createSvgUrl = (svg: string): string => {
  const svgBlob = new Blob([svg], { type: "image/svg+xml" });
  return URL.createObjectURL(svgBlob);
};

export const useIconGenerator = ({
  icon,
  iconColor,
  iconBackground,
  dimensions = DEFAULT_DIMENSIONS,
  generateResvg,
  fonts,
}: UseIconGeneratorParams) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [pngUrl, setPngObject] = useObjectUrl();
  const [svgUrl, setSvgObject] = useObjectUrl();

  useEffect(() => {
    let cancelled = false;

    // Reset state
    setIsLoading(true);
    setError(null);

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: it's ok
    const generate = async () => {
      try {
        if (!(icon && fonts.length > 0)) {
          return;
        }

        // Create icon content
        const content = createIconContent(icon, iconColor, dimensions.iconSize);
        if (!content) {
          throw new Error("Failed to create icon content");
        }

        // Generate SVG using Satori
        const svg = await generateSvg({
          content,
          iconBackground,
          width: dimensions.width,
          height: dimensions.height,
          fonts,
        });

        // Check if cancelled before delay
        // biome-ignore lint/nursery/noUnnecessaryConditions: this is wrong
        if (cancelled) {
          return;
        }

        // Update state
        setPngObject(await generateResvg(svg, dimensions.width));
        setSvgObject(createSvgUrl(svg));
      } catch (err) {
        // Don't set error if the operation was cancelled
        if (cancelled) {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      }
    };

    generate().finally(() => {
      if (!cancelled) {
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    icon,
    iconColor,
    iconBackground,
    dimensions.height,
    dimensions.width,
    dimensions.iconSize,
    generateResvg,
    fonts,
  ]);

  return { isLoading, pngObject: pngUrl, svgObject: svgUrl, error };
};
