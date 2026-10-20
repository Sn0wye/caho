'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

export type ElementSize = { width: number; height: number };

export function useElementSize(
  ref: RefObject<HTMLElement | null>
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
