import { SiGitlab } from "@icons-pack/react-simple-icons";
import { Code, Database, Settings, User } from "lucide";
import {
  CodeIcon,
  DatabaseIcon,
  DownloadIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import {
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { Font as FontOptions } from "satori";
import { siGitlab } from "simple-icons";
import { useDebounce } from "use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { ColorPaletteSelector } from "./components/ui/color-palette-selector";
import { CopyCurrentLinkInput } from "./components/ui/copy-link-input";
import { IconPreview } from "./components/ui/icon-preview";
import { IconSelector } from "./components/ui/icon-selector";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";
import { useResvgWorker } from "./hooks/resvg-worker";
import { useIconGenerator } from "./hooks/use-icon-generator";
import { loadFontData } from "./lib/font";
import { downloadFile, generateFilename } from "./lib/icon";
import type { Icon } from "./types/icon";

const genericIcons: Icon[] = [
  {
    type: "lucide",
    name: "Code",
    icon: Code,
    previewComponent: CodeIcon,
  },
  {
    type: "lucide",
    name: "User",
    icon: User,
    previewComponent: UserIcon,
  },
  {
    type: "lucide",
    name: "Settings",
    icon: Settings,
    previewComponent: SettingsIcon,
  },
  {
    type: "lucide",
    name: "Database",
    icon: Database,
    previewComponent: DatabaseIcon,
  },
] as const;

const brandIcons: Icon[] = [
  {
    type: "simple",
    name: "GitLab",
    icon: siGitlab,
    previewComponent: SiGitlab,
  },
] as const;

const lightColorPalette = {
  Basic: { bg: "#FAFAFA", icon: "#52525C" },
  Slate: { bg: "#F8FAFC", icon: "#334155" },
  Gray: { bg: "#F9FAFB", icon: "#374151" },
  Zinc: { bg: "#FAFAFA", icon: "#3F3F46" },
  Stone: { bg: "#FAFAF9", icon: "#44403C" },
  Red: { bg: "#FEF2F2", icon: "#DC2626" },
  Orange: { bg: "#FFF7ED", icon: "#EA580C" },
  Amber: { bg: "#FFFBEB", icon: "#D97706" },
  Yellow: { bg: "#FEFCE8", icon: "#CA8A04" },
  Lime: { bg: "#F7FEE7", icon: "#65A30D" },
  Green: { bg: "#F0FDF4", icon: "#16A34A" },
  Emerald: { bg: "#ECFDF5", icon: "#059669" },
  Teal: { bg: "#F0FDFA", icon: "#0D9488" },
  Cyan: { bg: "#ECFEFF", icon: "#0891B2" },
  Sky: { bg: "#F0F9FF", icon: "#0284C7" },
  Blue: { bg: "#EFF6FF", icon: "#2563EB" },
  Indigo: { bg: "#EEF2FF", icon: "#4F46E5" },
  Violet: { bg: "#F5F3FF", icon: "#7C3AED" },
  Purple: { bg: "#FAF5FF", icon: "#9333EA" },
  Fuchsia: { bg: "#FDF4FF", icon: "#C026D3" },
  Pink: { bg: "#FDF2F8", icon: "#DB2777" },
  Rose: { bg: "#FFF1F2", icon: "#E11D48" },
} as const;

const darkColorPalette = {
  Basic: { bg: "#0F0F0F", icon: "#A1A1AA" },
  Slate: { bg: "#0F172A", icon: "#CBD5E1" },
  Gray: { bg: "#111827", icon: "#D1D5DB" },
  Zinc: { bg: "#09090B", icon: "#D4D4D8" },
  Stone: { bg: "#0C0A09", icon: "#D6D3D1" },
  Red: { bg: "#450A0A", icon: "#F87171" },
  Orange: { bg: "#431407", icon: "#FB923C" },
  Amber: { bg: "#451A03", icon: "#FBBF24" },
  Yellow: { bg: "#422006", icon: "#FDE047" },
  Lime: { bg: "#1A2E05", icon: "#A3E635" },
  Green: { bg: "#052E16", icon: "#4ADE80" },
  Emerald: { bg: "#022C22", icon: "#34D399" },
  Teal: { bg: "#042F2E", icon: "#2DD4BF" },
  Cyan: { bg: "#083344", icon: "#22D3EE" },
  Sky: { bg: "#0C2C4C", icon: "#38BDF8" },
  Blue: { bg: "#1E1B4B", icon: "#60A5FA" },
  Indigo: { bg: "#1E1B4B", icon: "#A78BFA" },
  Violet: { bg: "#2E1065", icon: "#C084FC" },
  Purple: { bg: "#581C87", icon: "#D8B4FE" },
  Fuchsia: { bg: "#701A75", icon: "#E879F9" },
  Pink: { bg: "#831843", icon: "#F472B6" },
  Rose: { bg: "#881337", icon: "#FB7185" },
} as const;

function DownloadButton({
  objectUrl,
  type,
  fileType,
  iconName,
  iconColor,
  iconBackground,
  iconSize,
  outputSize,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  objectUrl: string | null;
  fileType: "png" | "svg";
  iconName: string;
  iconColor: string;
  iconBackground: string;
  iconSize: number;
  outputSize: number;
}) {
  const handleDownload = useCallback(() => {
    if (!objectUrl) {
      return;
    }

    const filename = generateFilename({
      selectedIcon: iconName,
      iconColor,
      iconBackground,
      iconSize,
      outputSize,
      extension: fileType,
    });

    downloadFile(objectUrl, filename);
  }, [
    objectUrl,
    iconName,
    iconColor,
    iconBackground,
    fileType,
    iconSize,
    outputSize,
  ]);

  return (
    <Button
      disabled={!objectUrl}
      onClick={handleDownload}
      type="button"
      {...props}
    >
      <DownloadIcon size={20} />
      {children}
    </Button>
  );
}

function App() {
  const [
    {
      iconType,
      selectedIcon,
      iconColor,
      iconBackground,
      iconSizePercentage,
      outputSize,
      isDarkMode,
    },
    setSettings,
  ] = useQueryStates(
    {
      iconType: parseAsStringEnum(["generic", "brand"]).withDefault("generic"),
      selectedIcon: parseAsStringEnum(
        genericIcons.map((icon) => icon.name),
      ).withDefault("Code"),
      iconColor: parseAsString.withDefault("#EA580C"),
      iconBackground: parseAsString.withDefault("#FFF7ED"),
      iconSizePercentage: parseAsFloat.withDefault(66.66), // 66.6666% rounded to 67%
      outputSize: parseAsInteger.withDefault(192),
      isDarkMode: parseAsBoolean.withDefault(false),
    },
    {
      urlKeys: {
        iconType: "it",
        selectedIcon: "si",
        iconColor: "ic",
        iconBackground: "ib",
        iconSizePercentage: "is",
        outputSize: "os",
        isDarkMode: "dm",
      },
    },
  );

  const [selectedIconData, setSelectedIconData] = useState<Icon | null>(null);
  const [fontData, setFontData] = useState<FontOptions[]>([]);

  const [debouncedOutputSize] = useDebounce(outputSize, 200);

  // Calculate actual icon size from percentage (using local state for immediate feedback)
  const iconSize = Math.round((iconSizePercentage / 100) * outputSize);
  const [debouncedIconSize] = useDebounce(iconSize, 200);

  // Function to find the color name by values
  const findColorName = (
    bg: string,
    icon: string,
    palette: Record<string, { bg: string; icon: string }>,
  ) => {
    return Object.entries(palette).find(
      ([, colors]) => colors.bg === bg && colors.icon === icon,
    )?.[0];
  };

  // Function to handle dark mode toggle with color mapping
  const handleDarkModeChange = (newIsDarkMode: boolean) => {
    const currentPalette = isDarkMode ? darkColorPalette : lightColorPalette;
    const newPalette = newIsDarkMode ? darkColorPalette : lightColorPalette;

    // Find current color name
    const currentColorName = findColorName(
      iconBackground,
      iconColor,
      currentPalette,
    );

    // If we found a matching color name, map it to the new palette
    if (currentColorName && currentColorName in newPalette) {
      const newColors = newPalette[currentColorName as keyof typeof newPalette];
      setSettings({
        iconBackground: newColors.bg,
        iconColor: newColors.icon,
      });
    }

    setSettings({
      isDarkMode: newIsDarkMode,
    });
  };

  const { generateObjectUrl } = useResvgWorker();

  const generateResvg = useCallback(
    (svg: string, width: number) => {
      return generateObjectUrl({
        svg,
        width,
      });
    },
    [generateObjectUrl],
  );

  // Load font data on mount
  useEffect(() => {
    loadFontData(
      "Geist Sans",
      new URL(
        "@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff",
        import.meta.url,
      ),
    )
      .then((data) => {
        setFontData([
          {
            name: "Geist Sans",
            data,
          },
        ]);
      })
      .catch(() => {
        // Handle font loading error silently
      });
  }, []);

  const { isLoading, pngObject, svgObject } = useIconGenerator({
    icon: selectedIconData,
    iconColor,
    iconBackground,
    dimensions: {
      width: debouncedOutputSize,
      height: debouncedOutputSize,
      iconSize: debouncedIconSize,
    },
    generateResvg,
    fonts: fontData,
  });

  // Update selected icon data
  useEffect(() => {
    if (selectedIcon) {
      const iconData = [...genericIcons, ...brandIcons].find(
        (icon) => icon.name === selectedIcon,
      );
      setSelectedIconData(iconData || null);
    }
  }, [selectedIcon]);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center font-bold text-3xl">
          GitLab Project Icon Generator
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            {/* Size Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Size Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Output Size Slider */}
                  <div className="space-y-2">
                    <Label htmlFor="output-size">
                      Output Size: {outputSize}×{outputSize}px
                    </Label>
                    <Slider
                      defaultValue={[192]}
                      id="output-size"
                      max={512}
                      min={64}
                      onValueChange={([value]) => {
                        setSettings({ outputSize: value });
                      }}
                      step={8}
                      value={[outputSize]}
                    />
                  </div>

                  {/* Icon Size Percentage Slider */}
                  <div className="space-y-2">
                    <Label htmlFor="icon-size">
                      Icon Size: {iconSizePercentage}% ({iconSize}px)
                    </Label>
                    <Slider
                      defaultValue={[67]}
                      id="icon-size"
                      max={100}
                      min={25}
                      onValueChange={([value]) => {
                        setSettings({ iconSizePercentage: value });
                      }}
                      step={0.1}
                      value={[iconSizePercentage]}
                    />
                  </div>

                  {/* Reset Button */}
                  <div className="pt-2">
                    <Button
                      onClick={() => {
                        setSettings({
                          outputSize: 192,
                          iconSizePercentage: 66.66,
                        });
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Icon Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Icon Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="account"
                  onValueChange={(v) =>
                    setSettings({ iconType: v as "generic" | "brand" })
                  }
                  value={iconType}
                >
                  <TabsList>
                    <TabsTrigger value="generic">Generic</TabsTrigger>
                    <TabsTrigger value="brand">Brand</TabsTrigger>
                  </TabsList>
                  <TabsContent value="generic">
                    <IconSelector
                      icons={genericIcons}
                      onValueChange={(icon) =>
                        setSettings({ selectedIcon: icon })
                      }
                      selectedIcon={selectedIcon}
                    />
                  </TabsContent>
                  <TabsContent value="brand">
                    <IconSelector
                      icons={brandIcons}
                      onValueChange={(icon) =>
                        setSettings({ selectedIcon: icon })
                      }
                      selectedIcon={selectedIcon}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorPaletteSelector
                  colorPalette={
                    isDarkMode ? darkColorPalette : lightColorPalette
                  }
                  isDarkMode={isDarkMode}
                  onDarkModeChange={handleDarkModeChange}
                  onValueChange={(bg, icon) =>
                    setSettings({ iconBackground: bg, iconColor: icon })
                  }
                  selectedBackground={iconBackground}
                  selectedIcon={iconColor}
                  showThemeToggle={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview and Download */}
          <div className="order-first space-y-6 lg:sticky lg:top-6 lg:order-1 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>
                  Preview ({outputSize}×{outputSize})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-4">
                  <div className="space-y-2">
                    <IconPreview
                      className="h-42 w-42"
                      isLoading={isLoading}
                      src={pngObject || undefined}
                    />
                    <span className="block text-center font-semibold">PNG</span>
                  </div>
                  <div className="space-y-2">
                    <IconPreview
                      className="h-42 w-42"
                      isLoading={isLoading}
                      src={svgObject || undefined}
                    />
                    <span className="block text-center font-semibold">SVG</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <DownloadButton
                    disabled={!pngObject || isLoading}
                    fileType="png"
                    iconBackground={iconBackground}
                    iconColor={iconColor}
                    iconName={selectedIcon}
                    iconSize={iconSize}
                    objectUrl={pngObject}
                    outputSize={outputSize}
                  >
                    Download PNG Icon
                  </DownloadButton>

                  <DownloadButton
                    disabled={!svgObject || isLoading}
                    fileType="svg"
                    iconBackground={iconBackground}
                    iconColor={iconColor}
                    iconName={selectedIcon}
                    iconSize={iconSize}
                    objectUrl={svgObject}
                    outputSize={outputSize}
                  >
                    Download SVG Icon
                  </DownloadButton>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Link</CardTitle>
              </CardHeader>
              <CardContent>
                <CopyCurrentLinkInput />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t pt-8 text-center text-muted-foreground text-sm">
          <p className="mb-2">
            Made with ❤️ for the GitLab community by{" "}
            <a
              className="underline hover:text-foreground"
              href="https://github.com/giacomoferretti"
              rel="noopener noreferrer"
              target="_blank"
            >
              Giacomo Ferretti
            </a>
          </p>
          <p>
            <a
              className="underline hover:text-foreground"
              href="https://github.com/giacomoferretti/gitlab-icon-generator"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>{" "}
            • If you like this tool, please consider giving it a star! ⭐
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
