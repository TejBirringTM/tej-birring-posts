import { useEffect } from 'react';

type DocEventHandler<T extends keyof DocumentEventMap> = (event: DocumentEventMap[T]) => void;

export function useDocumentEvent<T extends keyof DocumentEventMap>(
  eventType: T,
  handler: DocEventHandler<T>,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    // Check if window is available to ensure we're on the client side
    if (typeof window !== 'undefined') {
        console.log("installed");
      document.addEventListener(eventType, handler, options);

      // Cleanup function
      return () => {
        document.removeEventListener(eventType, handler, options);
      };
    }
  }, [eventType, handler, options]);
}


type WinEventHandler<T extends keyof WindowEventMap> = (event: WindowEventMap[T]) => void;

export function useWindowEvent<T extends keyof WindowEventMap>(
  eventType: T,
  handler: WinEventHandler<T>,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    // Check if window is available to ensure we're on the client side
    if (typeof window !== 'undefined') {
      window.addEventListener(eventType, handler, options);

      // Cleanup function
      return () => {
        window.removeEventListener(eventType, handler, options);
      };
    }
  }, [eventType, handler, options]);
}