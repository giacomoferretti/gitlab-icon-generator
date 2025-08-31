import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

function CopyCurrentLinkInput({
  className,
  type,
  ...props
}: Omit<React.ComponentProps<"input">, "value">) {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // biome-ignore lint/suspicious/noConsole: let me do it
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative">
      <Input
        className={cn("pr-10", className)}
        readOnly
        value={currentUrl}
        {...props}
      />
      <Button
        className="absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
        onClick={handleCopy}
        size="sm"
        type="button"
        variant="ghost"
      >
        {copied ? (
          <CheckIcon aria-hidden="true" className="h-4 w-4" />
        ) : (
          <CopyIcon aria-hidden="true" className="h-4 w-4" />
        )}
        <span className="sr-only">{copied ? "Copied!" : "Copy link"}</span>
      </Button>
    </div>
  );
}

export { CopyCurrentLinkInput };
