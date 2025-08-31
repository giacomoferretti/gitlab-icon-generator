import { useEffect, useState } from "react";

export const useObjectUrl = (initialUrl = "") => {
  const [objectUrl, setObjectUrl] = useState(initialUrl);

  // Cleanup on unmount or when URL changes
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return [objectUrl, setObjectUrl] as const;
};
