import { useCallback, useEffect, useRef, useState } from "react";
import type { ResvgWorkerMessage, ResvgWorkerMessageResult } from "./types";

export const useResvgWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, (url: string) => void>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL("./resvg-worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;
    setIsReady(true);

    const handleMessage = (e: MessageEvent<ResvgWorkerMessageResult>) => {
      const { _id, url } = e.data;
      const resolve = pendingRef.current.get(_id);
      if (resolve) {
        resolve(url);
        pendingRef.current.delete(_id);
      }
    };

    worker.addEventListener("message", handleMessage);

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
      workerRef.current = null;
      pendingRef.current.clear();
      setIsReady(false);
    };
  }, []);

  const generateObjectUrl = useCallback(
    (message: Omit<ResvgWorkerMessage, "_id">): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error("Worker not initialized"));
          return;
        }

        const _id = Math.random();
        pendingRef.current.set(_id, resolve);
        // console.log(pendingRef.current);

        try {
          workerRef.current.postMessage({
            ...message,
            _id,
          } satisfies ResvgWorkerMessage);
        } catch (error) {
          pendingRef.current.delete(_id);
          reject(error);
        }
      });
    },
    [],
  );

  return { generateObjectUrl, isReady };
};
