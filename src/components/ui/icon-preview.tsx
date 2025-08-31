import { Loader2Icon } from "lucide-react";
import { cn } from "~/lib/utils";

type IconPreviewProps = {
  isLoading: boolean;
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function IconPreview({
  isLoading,
  src,
  alt = "Icon preview",
  size = 192,
  className,
}: IconPreviewProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {src && isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
          <Loader2Icon className="size-12 animate-spin" strokeWidth={3} />
        </div>
      )}

      {src && (
        <img
          alt={alt}
          aria-hidden
          className={cn({
            "blur-sm": isLoading,
          })}
          height={size}
          src={src}
          width={size}
        />
      )}

      {!src && (
        <div className="grid size-full place-items-center rounded-lg border-2 p-8">
          No icon preview available
        </div>
      )}
    </div>
  );
}
