import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "~/lib/utils";
import { Switch } from "./switch";

type ColorPalette = {
  [key: string]: {
    bg: string;
    icon: string;
  };
};

type ColorPaletteSelectorProps = {
  colorPalette: ColorPalette;
  selectedBackground: string;
  selectedIcon: string;
  onValueChange: (background: string, icon: string) => void;
  className?: string;
  isDarkMode?: boolean;
  onDarkModeChange?: (isDark: boolean) => void;
  showThemeToggle?: boolean;
};

export function ColorPaletteSelector({
  colorPalette,
  selectedBackground,
  selectedIcon,
  onValueChange,
  className,
  isDarkMode = false,
  onDarkModeChange,
  showThemeToggle = false,
}: ColorPaletteSelectorProps) {
  const currentValue = `${selectedBackground}-${selectedIcon}`;

  return (
    <div className="space-y-4">
      {showThemeToggle && onDarkModeChange && (
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
          <Switch checked={isDarkMode} onCheckedChange={onDarkModeChange} />
        </div>
      )}

      <RadioGroup.Root
        className={cn("grid grid-cols-3 gap-3", className)}
        onValueChange={(v) => {
          const [bg, icon] = v.split("-");
          onValueChange(bg, icon);
        }}
        value={currentValue}
      >
        {Object.entries(colorPalette).map(([name, colors]) => (
          <RadioGroup.Item
            className={cn(
              "cursor-pointer rounded-lg border p-3 shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
            )}
            key={name}
            value={`${colors.bg}-${colors.icon}`}
          >
            <div className="mb-2 flex justify-center gap-1">
              <div
                className="h-4 w-4 rounded"
                style={{
                  backgroundColor: colors.bg,
                  border: "1px solid #e5e7eb",
                }}
              />
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: colors.icon }}
              />
            </div>
            <div className="font-medium text-xs">{name}</div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
