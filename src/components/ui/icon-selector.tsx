import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "~/lib/utils";
import type { Icon } from "~/types/icon";

type IconSelectorProps = {
  icons: readonly Icon[];
  selectedIcon: string;
  onValueChange: (value: string) => void;
};

export function IconSelector({
  icons,
  selectedIcon,
  onValueChange,
}: IconSelectorProps) {
  return (
    <RadioGroup.Root
      className="grid grid-cols-4 gap-3"
      onValueChange={onValueChange}
    >
      {icons.map((icon) => {
        const PreviewIcon = icon.previewComponent;
        const isSelected = selectedIcon === icon.name;

        return (
          <RadioGroup.Item
            checked={isSelected}
            className={cn(
              "cursor-pointer rounded-lg border p-3 shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
            )}
            key={icon.name}
            value={icon.name}
          >
            <PreviewIcon className="mx-auto" />
            <div className="mt-1 font-medium text-xs">{icon.name}</div>
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}
