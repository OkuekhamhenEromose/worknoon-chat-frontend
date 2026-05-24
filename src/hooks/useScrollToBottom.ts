import { useRef, useEffect } from 'react';

export function useScrollToBottom<T extends HTMLElement>(dependency: unknown) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dependency]);

  return ref;
}