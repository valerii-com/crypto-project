import { useEffect } from 'react';

export function useOnClickOutside(ref: any, handler: any) {
  useEffect(() => {
    const listener = (event: any) => {
      const isModalClick = document
        .querySelector('#modal > div > div > div')
        ?.contains(event.target);

      if (!ref.current || ref.current.contains(event.target) || isModalClick) {
        return;
      }

      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
